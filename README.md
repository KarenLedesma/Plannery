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
1. `git clone <url-del-repo>`
2. `cp .env.example .env` y completar las variables
3. Instalar dependencias y levantar (pendiente hasta definir el stack)

## Equipo
- Nombre Apellido: (a completar con quién hizo qué)

## Uso de IA
Ver `docs/uso-de-ia.md`
