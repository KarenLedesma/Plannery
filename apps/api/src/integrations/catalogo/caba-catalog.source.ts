import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CatalogSource, LugarExterno } from './catalog-source.interface';

const FUENTE = 'caba-datos-abiertos';
const URL_DETALLE = 'https://datosabiertos-catastro-apis.buenosaires.gob.ar/getObjectContent';
const RUTA_LISTA = join(__dirname, '../../../prisma/data/catalogo-destacados.json');
const PAUSA_MS = 300; // pausa entre pedidos: es un servicio público
const TIEMPO_MAXIMO_MS = 8000;

const MESES: Record<string, string> = {
  enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
  julio: '07', agosto: '08', septiembre: '09', setiembre: '09', octubre: '10',
  noviembre: '11', diciembre: '12',
};

interface EntradaLista {
  fuenteId: string;
  nombreApi: string;
  nombre: string;
  tipo: 'INTERIOR' | 'EXTERIOR' | 'MIXTA';
  direccion?: string;
  descripcion: string;
}

interface RespuestaDetalle {
  contenido?: { nombreId: string; valor: string }[];
  fechaActualizacion?: string; // ej. "Septiembre 2012"
}

// Para comparar nombres: sin tildes, sin mayúsculas, sin "(CABA)" ni espacios o puntos sobrantes
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\(\s*caba(?:\s*,\s*caba)?\s*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.+$/, '');
}

function capitalizar(texto: string): string {
  return texto.trim().toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

// "Septiembre 2012" -> "2012-09-01". Si no se entiende, no se guarda fecha.
function fechaDesdeTexto(texto?: string): string | undefined {
  const partes = (texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().split(/\s+/);
  const mes = MESES[partes[0]];
  const anio = partes[1];
  return mes && /^\d{4}$/.test(anio) ? `${anio}-${mes}-01` : undefined;
}

const esperar = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

export class CabaCatalogSource implements CatalogSource {
  constructor(private readonly rutaLista: string = RUTA_LISTA) {}

  async obtenerLugares(): Promise<LugarExterno[]> {
    const lista = JSON.parse(readFileSync(this.rutaLista, 'utf8')) as EntradaLista[];
    const lugares: LugarExterno[] = [];
    for (const entrada of lista) {
      try {
        lugares.push(await this.traer(entrada));
      } catch (error) {
        // Un lugar con problemas no frena a los demás: se avisa y se sigue
        console.warn(`AVISO: se omite ${entrada.fuenteId} (${entrada.nombre}): ${(error as Error).message}`);
      }
      await esperar(PAUSA_MS);
    }
    return lugares;
  }

  private async traer(entrada: EntradaLista): Promise<LugarExterno> {
    const url = `${URL_DETALLE}?id=${encodeURIComponent(entrada.fuenteId)}`;
    const respuesta = await fetch(url, { signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS) });
    if (!respuesta.ok) throw new Error(`la API respondió ${respuesta.status}`);

    const datos = (await respuesta.json()) as RespuestaDetalle;
    const campos = new Map((datos.contenido ?? []).map((c) => [c.nombreId, c.valor]));

    // Verificación: el ID tiene que seguir apuntando al lugar que elegimos
    const nombreApi = campos.get('nombre');
    if (!nombreApi) throw new Error('la API no devolvió el nombre');
    if (normalizar(nombreApi) !== normalizar(entrada.nombreApi)) {
      throw new Error(`el nombre no coincide, la API devolvió "${nombreApi.trim()}"`);
    }

    const categoria = campos.get('_subcategoria') || campos.get('_categoria') || '';
    const direccionApi = campos.get('direccion') || '';
    return {
      fuente: FUENTE,
      fuenteId: entrada.fuenteId,
      nombre: entrada.nombre,
      tipo: entrada.tipo,
      descripcion: entrada.descripcion,
      categoria: categoria ? capitalizar(categoria) : undefined,
      direccion: entrada.direccion ?? (direccionApi ? capitalizar(direccionApi) : undefined),
      relevadoEn: fechaDesdeTexto(datos.fechaActualizacion),
    };
  }
}