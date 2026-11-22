import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GuardarIaConfigDto } from './resumen.dto';
import { desencriptarApiKey, encriptarApiKey } from './crypto-key.util';

@Injectable()
export class ResumenService {
  constructor(private prisma: PrismaService) {}

  // --- ABM DE API KEY POR USUARIO ---

  async obtenerConfig(usuarioId: string) {
    const config = await this.prisma.usuarioIaConfig.findUnique({
      where: { usuarioId },
    });

    if (!config) {
      return {
        configurada: false,
        proveedor: 'gemini',
        ultimos4: null,
        actualizadoEn: null,
      };
    }

    let ultimos4 = '****';
    try {
      const keyPlana = desencriptarApiKey(config.apiKeyEncrypted);
      ultimos4 = keyPlana.slice(-4);
    } catch {
      ultimos4 = '****';
    }

    return {
      configurada: true,
      proveedor: config.proveedor,
      ultimos4,
      actualizadoEn: config.actualizadoEn,
    };
  }

  async guardarConfig(usuarioId: string, dto: GuardarIaConfigDto) {
    const proveedor = dto.proveedor ?? 'gemini';
    const apiKeyEncrypted = encriptarApiKey(dto.apiKey);

    const guardada = await this.prisma.usuarioIaConfig.upsert({
      where: { usuarioId },
      create: {
        usuarioId,
        proveedor,
        apiKeyEncrypted,
      },
      update: {
        proveedor,
        apiKeyEncrypted,
      },
    });

    return {
      configurada: true,
      proveedor: guardada.proveedor,
      ultimos4: dto.apiKey.trim().slice(-4),
      actualizadoEn: guardada.actualizadoEn,
    };
  }

  async eliminarConfig(usuarioId: string) {
    const existente = await this.prisma.usuarioIaConfig.findUnique({
      where: { usuarioId },
    });

    if (!existente) {
      throw new NotFoundException('No tenés una API Key configurada para eliminar');
    }

    await this.prisma.usuarioIaConfig.delete({
      where: { usuarioId },
    });

    return { eliminada: true };
  }

  // --- GENERACIÓN DE RESUMEN DEL VIAJE ---

  async generarResumenViaje(viajeId: string, usuarioId: string) {
    const viaje = await this.prisma.viaje.findUnique({
      where: { id: viajeId },
      include: {
        destino: true,
        itinerario: {
          include: { actividad: true },
          orderBy: [{ fecha: 'asc' }, { orden: 'asc' }],
        },
        gastos: {
          orderBy: { creadoEn: 'asc' },
        },
      },
    });

    if (!viaje) {
      throw new NotFoundException('El viaje solicitado no existe');
    }

    if (viaje.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tenés permiso para acceder a este viaje');
    }

    const config = await this.prisma.usuarioIaConfig.findUnique({
      where: { usuarioId },
    });

    if (!config) {
      throw new BadRequestException(
        'Configurá tu API Key de IA antes de generar el resumen del viaje',
      );
    }

    const apiKey = desencriptarApiKey(config.apiKeyEncrypted);
    const prompt = this.construirPrompt(viaje);
    const textoResumen = await this.invocarProveedorIa(config.proveedor, apiKey, prompt);

    return {
      viajeId: viaje.id,
      proveedor: config.proveedor,
      resumen: textoResumen,
      generadoEn: new Date().toISOString(),
    };
  }

  private construirPrompt(viaje: any): string {
    const totalEstimado = viaje.gastos.reduce(
      (acc: number, g: any) => acc + Number(g.montoEstimado ?? 0),
      0,
    );
    const totalReal = viaje.gastos.reduce(
      (acc: number, g: any) => acc + Number(g.montoReal ?? 0),
      0,
    );

    const actividadesTexto =
      viaje.itinerario.length > 0
        ? viaje.itinerario
            .map(
              (item: any) =>
                `- ${item.fecha.toISOString().slice(0, 10)}: ${item.actividad.nombre} (${item.actividad.tipo})${item.nota ? ` — Nota: ${item.nota}` : ''}`,
            )
            .join('\n')
        : 'Sin actividades cargadas aún.';

    const gastosTexto =
      viaje.gastos.length > 0
        ? viaje.gastos
            .map(
              (g: any) =>
                `- [${g.fase} / ${g.categoria}] ${g.descripcion}: estimado $${Number(g.montoEstimado).toFixed(2)}, real ${g.montoReal !== null ? `$${Number(g.montoReal).toFixed(2)}` : 'pendiente'}`,
            )
            .join('\n')
        : 'Sin gastos registrados aún.';

    return `Sos un asistente de planificación de viajes para la app Plannery.
Generá un resumen ejecutivo claro, útil y en español rioplatense sobre este viaje (no inventes datos que no estén abajo):

- Viaje: ${viaje.nombre}
- Destino: ${viaje.destino.nombre}
- Fechas: ${viaje.fechaInicio.toISOString().slice(0, 10)} al ${viaje.fechaFin.toISOString().slice(0, 10)}
- Presupuesto general: ${viaje.moneda} ${Number(viaje.presupuesto).toFixed(2)}

Itinerario planificado:
${actividadesTexto}

Gastos (Estimado total: ${viaje.moneda} ${totalEstimado.toFixed(2)} | Real total: ${viaje.moneda} ${totalReal.toFixed(2)}):
${gastosTexto}

Incluí:
1. Panorama general del itinerario y ritmo del viaje.
2. Análisis breve del presupuesto (estimado vs. real y margen disponible).
3. Dos o tres recomendaciones prácticas según las actividades cargadas.`;
  }

  private async invocarProveedorIa(
    proveedor: string,
    apiKey: string,
    prompt: string,
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      if (proveedor === 'gemini') {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
            signal: controller.signal,
          },
        );

        if (res.status === 400 || res.status === 401 || res.status === 403) {
          throw new UnauthorizedException('La API Key de Gemini es inválida o no tiene permisos');
        }
        if (res.status === 429) {
          throw new BadRequestException('Se excedió la cuota gratuita de tu API Key de Gemini');
        }
        if (!res.ok) {
          throw new BadGatewayException(`Error del servicio de Gemini (${res.status})`);
        }

        const data: any = await res.json();
        const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!texto) {
          throw new BadGatewayException('Gemini devolvió una respuesta vacía');
        }
        return texto;
      }

      const url =
        proveedor === 'groq'
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';
      const model = proveedor === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: controller.signal,
      });

      if (res.status === 401 || res.status === 403) {
        throw new UnauthorizedException(`La API Key de ${proveedor} es inválida`);
      }
      if (res.status === 429) {
        throw new BadRequestException(`Se excedió el límite de uso de tu API Key de ${proveedor}`);
      }
      if (!res.ok) {
        throw new BadGatewayException(`Error del servicio de ${proveedor} (${res.status})`);
      }

      const data: any = await res.json();
      const texto = data?.choices?.[0]?.message?.content;
      if (!texto) {
        throw new BadGatewayException(`El proveedor ${proveedor} devolvió una respuesta vacía`);
      }
      return texto;
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        throw new BadGatewayException('El proveedor de IA tardó demasiado en responder');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}