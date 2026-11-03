# Arquitectura

```
Navegador (React)  ──HTTPS/JSON + cookie httpOnly──▶  API (NestJS)  ──Prisma──▶  PostgreSQL
                                                          │
                                                          ├──▶ Open-Meteo (pronóstico)
                                                          └──▶ Servicio de IA (resumen)
```

## Tres capas más seguridad
- **Frontend (`apps/web`):** pantallas, formularios y rutas protegidas. Muestra u oculta cosas según el rol, pero **nunca decide permisos**.
- **Backend (`apps/api`):** la lógica de negocio y la seguridad. Cada endpoint protegido verifica la sesión (401), el rol (403) y que el recurso pertenezca al usuario (404).
- **Base de datos:** PostgreSQL gestionado en la nube. El esquema vive en `apps/api/prisma/schema.prisma`.

## Cómo está organizado el backend
Un solo servidor dividido en **módulos por funcionalidad** (`apps/api/src/modules/`). Cada módulo es dueño de sus rutas, su validación y su lógica, y se conecta al resto con una línea en `app.module.ts`.

Lo que depende de un tercero **no se usa directamente**: queda detrás de una interfaz en `apps/api/src/integrations/`.

| Integración | Interfaz | Hoy | Para cambiarla |
|---|---|---|---|
| Pronóstico | `WeatherProvider` | Open-Meteo | Escribir otro adaptador y registrarlo |
| Resumen con IA | `AiProvider` | A definir | Ídem |
| Catálogo de lugares | `CatalogSource` | Datos abiertos de CABA | Ídem, para sumar otra ciudad |

Por qué: ver `decisiones/0003-integraciones-detras-de-interfaces.md`.

## Seguridad en cada pedido
1. `JwtAuthGuard` lee la cookie y verifica el token. Sin token válido: **401**.
2. `RolesGuard` compara el rol con el que exige el endpoint. Rol incorrecto: **403**.
3. El servicio filtra siempre por el usuario dueño. Recurso ajeno: **404** (igual que si no existiera, para no revelar qué existe).
4. `ValidationPipe` rechaza datos con forma incorrecta antes de llegar a la lógica.
