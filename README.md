# Plannery

Plannery te ayuda a planificar un viaje por Argentina según el clima y a controlar lo que gastás antes, durante y después: recomendaciones de actividades adaptadas al pronóstico, itinerario por día, gastos con estimado vs. real y un resumen final con apoyo de IA.


## Demo
- Prototipo de interfaz: abrir `prototype/index.html` en el navegador (datos de ejemplo, sin backend).
- Frontend: (pendiente)
- API: (pendiente)
- Video: (pendiente)

## Usuarios de prueba
| Rol | Email | Contraseña |
|---------|-------|------------|
| admin | (pendiente) | (pendiente) |
| viajero | (pendiente) | (pendiente) |

## Funcionalidades (MVP)
- Registro e inicio de sesión con roles (viajero/a y admin).
- Viajes con itinerario por día.
- Recomendaciones de actividades según el pronóstico del clima (Ciudad de Buenos Aires).
- Gastos con estimado vs. real, por categoría y por fase (antes / durante / después).
- Administración del catálogo de actividades (rol admin).
- Resumen del viaje con IA (desde el backend).

## Stack
React · NestJS · PostgreSQL (Prisma) · JWT en cookie httpOnly · Vercel y Render (stack tentativo; justificación en `docs/justificacion.md`).

## Arquitectura
Tres capas más autenticación y autorización verificadas en el backend. Diagrama pendiente en `docs/arquitectura.md`.

## Cómo correrlo en local
Requisitos: Node.js 20 o superior, pnpm y una base PostgreSQL.

1. `git clone <url-del-repo>` y `cd Plannery`
2. `pnpm install` (si aparece el error ERR_PNPM_IGNORED_BUILDS, correr `pnpm approve-builds` y aprobar los paquetes de Prisma)
3. `copy apps\api\.env.example apps\api\.env` y completar las variables
4. `pnpm --filter api exec prisma migrate dev` (crea las tablas)
5. `pnpm --filter api seed` (carga los usuarios de prueba y el destino)
6. `pnpm dev:api` (API en http://localhost:3000) y, en otra terminal, `pnpm dev:web` (web en http://localhost:5173)

## Equipo
- Nombre Apellido: (a completar con quién hizo qué)

## Uso de IA
Ver `docs/uso-de-ia.md`
