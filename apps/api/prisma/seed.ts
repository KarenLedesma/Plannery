import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = process.env.SEED_ADMIN_PASSWORD;
  const userPass = process.env.SEED_USER_PASSWORD;
  if (!adminPass || !userPass) {
    throw new Error('Definí SEED_ADMIN_PASSWORD y SEED_USER_PASSWORD en apps/api/.env');
  }

  // upsert: se puede correr varias veces sin duplicar nada
  await prisma.destino.upsert({
    where: { slug: 'caba' },
    update: {},
    create: { nombre: 'Ciudad de Buenos Aires', slug: 'caba', latitud: -34.6037, longitud: -58.3816 },
  });

  await prisma.usuario.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: { nombre: 'Admin Demo', email: 'admin@demo.com', passwordHash: await bcrypt.hash(adminPass, 10), rol: 'ADMIN' },
  });

  await prisma.usuario.upsert({
    where: { email: 'viajero@demo.com' },
    update: {},
    create: { nombre: 'Viajero Demo', email: 'viajero@demo.com', passwordHash: await bcrypt.hash(userPass, 10), rol: 'VIAJERO' },
  });

  console.log('Seed listo: destino caba, admin@demo.com y viajero@demo.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());