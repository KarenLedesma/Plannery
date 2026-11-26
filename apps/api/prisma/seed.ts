import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Si no están en el .env, usa estas claves por defecto para que siempre sepas cuáles son
  const adminPass = process.env.SEED_ADMIN_PASSWORD || 'Admin1234!';
  const userPass = process.env.SEED_USER_PASSWORD || 'Viajero1234!';

  const adminHash = await bcrypt.hash(adminPass, 10);
  const userHash = await bcrypt.hash(userPass, 10);

  await prisma.destino.upsert({
    where: { slug: 'caba' },
    update: {},
    create: {
      nombre: 'Ciudad de Buenos Aires',
      slug: 'caba',
      latitud: -34.6037,
      longitud: -58.3816,
    },
  });

  // Incluimos passwordHash en update para que pise cualquier clave vieja o sin hashear
  await prisma.usuario.upsert({
    where: { email: 'admin@demo.com' },
    update: { passwordHash: adminHash },
    create: {
      nombre: 'Admin Demo',
      email: 'admin@demo.com',
      passwordHash: adminHash,
      rol: 'ADMIN',
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'viajero@demo.com' },
    update: { passwordHash: userHash },
    create: {
      nombre: 'Viajero Demo',
      email: 'viajero@demo.com',
      passwordHash: userHash,
      rol: 'VIAJERO',
    },
  });

  console.log('Seed lista:');
  console.log(`- Admin:   admin@demo.com   | Clave: ${adminPass}`);
  console.log(`- Viajero: viajero@demo.com | Clave: ${userPass}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());