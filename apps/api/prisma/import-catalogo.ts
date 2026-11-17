import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { CabaCatalogSource } from '../src/integrations/catalogo/caba-catalog.source';

const prisma = new PrismaClient();

async function main() {
  const destino = await prisma.destino.findUnique({ where: { slug: 'caba' } });
  if (!destino) {
    throw new Error("No existe el destino 'caba'. Corré primero: pnpm --filter api seed");
  }

  const antes = await prisma.actividad.count({ where: { destinoId: destino.id } });
  console.log('Pidiendo los lugares a la API de la Ciudad (tarda unos segundos)...');
  const lugares = await new CabaCatalogSource().obtenerLugares();

  for (const lugar of lugares) {
    if (!lugar.tipo) {
      console.warn(`AVISO: se omite ${lugar.fuenteId}: no tiene tipo`);
      continue;
    }
    const datos = {
      nombre: lugar.nombre,
      descripcion: lugar.descripcion ?? null,
      tipo: lugar.tipo,
      categoria: lugar.categoria ?? null,
      direccion: lugar.direccion ?? null,
      relevadoEn: lugar.relevadoEn ? new Date(`${lugar.relevadoEn}T00:00:00Z`) : null,
    };
    // upsert: si el lugar ya existe se actualiza; si no, se crea. Se puede correr varias veces.
    // Al actualizar NO se toca "activa": si el admin archivó un lugar, sigue archivado.
    await prisma.actividad.upsert({
      where: { fuente_fuenteId: { fuente: lugar.fuente, fuenteId: lugar.fuenteId } },
      update: datos,
      create: { ...datos, destinoId: destino.id, fuente: lugar.fuente, fuenteId: lugar.fuenteId },
    });
  }

  const despues = await prisma.actividad.count({ where: { destinoId: destino.id } });
  console.log(
    `Importación lista: ${lugares.length} lugares procesados. Actividades del destino: ${antes} antes, ${despues} después.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());