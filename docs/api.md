# Endpoints

Cada dueña completa su sección al terminar la funcionalidad (hay una tarea de Trello para eso).

| Método y ruta | Acceso | Funcionalidad | Estado |
|---|---|---|---|
| `POST /auth/register` | público | F1 | pendiente |
| `POST /auth/login` | público | F1 | pendiente |
| `POST /auth/logout` | público | F1 | pendiente |
| `GET /auth/me` | logueado | F1 | pendiente |
| `GET /viajes`, `POST /viajes` | logueado | F2 | hecho |
| `GET/PATCH/DELETE /viajes/:id` | dueño | F2 | hecho |
| `GET/POST /viajes/:id/itinerario` | dueño | F2 | pendiente |
| `PATCH/DELETE /viajes/:id/itinerario/:itemId` | dueño | F2 | pendiente |
| `GET /actividades` | logueado | F3 | hecho |
| `POST /actividades`, `PATCH/DELETE /actividades/:id` | solo ADMIN | F3 | hecho |
| `GET /viajes/:id/recomendaciones` | dueño | F3 | pendiente |
| `GET/POST /viajes/:id/gastos` | dueño | F4 | pendiente |
| `PATCH/DELETE /viajes/:id/gastos/:gastoId` | dueño | F4 | pendiente |
| `GET /viajes/:id/gastos/comparacion` | dueño | F4 | pendiente |
| `POST /viajes/:id/resumen` | dueño | F5 | pendiente |

## F2 · Viajes (F2-01)

### Resumen
CRUD de viajes con aislamiento de datos por usuario. Cada viajero ve y modifica solo sus propios viajes. El endpoint `PATCH` valida que las fechas sean coherentes y que el `destinoId` exista. Borrar un viaje elimina en cascada su itinerario y sus gastos.

### Endpoints

#### `GET /viajes` — Listar mis viajes
- **Acceso:** logueado (req. cookie `token` válida)
- **Respuesta (200):**
  ```json
  [
    {
      "id": "uuid",
      "nombre": "Viaje a CABA",
      "destinoId": "uuid",
      "destino": { "id": "uuid", "nombre": "Ciudad de Buenos Aires", "slug": "caba" },
      "fechaInicio": "2026-12-01T03:00:00.000Z",
      "fechaFin": "2026-12-07T03:00:00.000Z",
      "presupuesto": "150000.00",
      "moneda": "ARS",
      "createdAt": "2026-11-10T12:34:56.789Z",
      "updatedAt": "2026-11-10T12:34:56.789Z"
    }
  ]
  ```
- **Errores:**
  - **401** sin cookie o token inválido.
  - **404** si el usuario no tiene viajes (retorna `[]`).

#### `POST /viajes` — Crear un viaje
- **Acceso:** logueado.
- **Cuerpo (201):**
  ```json
  { "nombre": "Viaje a CABA", "destinoId": "uuid-del-destino", "fechaInicio": "2026-12-01", "fechaFin": "2026-12-07", "presupuesto": 150000, "moneda": "ARS" }
  ```
- **Validaciones:**
  - `nombre`: mín. 2, máx. 80 caracteres.
  - `destinoId`: debe existir en la tabla `destinos`.
  - `fechaInicio`/`fechaFin`: formato `YYYY-MM-DD`; `fechaFin` no puede ser anterior a `fechaInicio`.
  - `presupuesto`: número entero ≥ 0.
  - `moneda`: opcional, máx. 3 caracteres (default `ARS`).
- **Errores:**
  - **400** si falla alguna validación de DTO (formato de fecha, rango, existencia de destino, número negativo).
  - **401** sin sesión.

#### `GET /viajes/:id` — Ver un viaje
- **Acceso:** dueño del viaje (el `id` debe pertenecer al usuario logueado).
- **Parametro:** `:id` debe ser UUID válido (sino **400**).
- **Respuesta (200):** mismo objeto que en `GET /viajes`.
- **Errores:**
  - **400** si `:id` no es UUID.
  - **404** si el viaje no existe o no pertenece al usuario (misma respuesta que si no existiera, para no revelar información).

#### `PATCH /viajes/:id` — Editar un viaje
- **Acceso:** dueño del viaje.
- **Parametro:** `:id` UUID obligatorio (**400** si no lo es).
- **Cuerpo opcional:** cualquiera de los campos de `CrearViajeDto` (`nombre`, `destinoId`, `fechaInicio`, `fechaFin`, `presupuesto`, `moneda`).
- **Validación especial:** si el cuerpo incluye `fechaInicio` o `fechaFin`, se validan **ambas juntas** respecto de sus valores actuales en la base de datos (no es suficiente que una sea válida por sí misma).
- **Respuesta (200):** objeto del viaje actualizado (igual estructura que en `GET`).
- **Errores:**
  - **400** datos inválidos o rango de fechas incoherente.
  - **404** viaje ajeno o inexistente.

#### `DELETE /viajes/:id` — Borrar un viaje
- **Acceso:** dueño del viaje.
- **Parametro:** `:id` UUID obligatorio (**400** si no lo es).
- **Respuesta (200):** `{ "message": "Viaje eliminado" }` (o vacío).
- **Comportamiento:** el esquema Prisma borra en cascada los `ItinerarioItem` y `Gasto` asociados. No es posible borrar si hay actividades dependientes sin antes borrarlos (o el cascade los borra).
- **Errores:**
  - **400** si `:id` no es UUID.
  - **404** viaje ajeno o inexistente.

### Errores generales (todos los endpoints de F2)

| Código | Cuándo ocurre | Cuerpo de respuesta |
|---|---|---|
| **401** | Falta la cookie `token`, o el token es inválido/vencido. | `{ "statusCode": 401, "message": "Unauthorized" }` |
| **400** | Datos de request inválidos (DTO validation failed, formato de fecha incorrecto, `presupuesto` negativo, `id` no UUID, validación de negocio fallida). | `{ "statusCode": 400, "message": "Bad request ...", ... }` |
| **404** | Recurso solicitado no existe o el usuario no es dueño (viaje/año destino ajeno). Se devuelve 404 igual que si no existiera, para no filtrar qué rutas/recursos hay en el sistema. | `{ "statusCode": 404, "message": "Not found" }` |

### Respuesta modelo (viaje individual)
Cada viaje devuelto por la API incluye:

```json
{
  "id": "uuid",
  "nombre": "Viaje a CABA",
  "destinoId": "uuid",
  "destino": { "id": "uuid", "nombre": "Ciudad de Buenos Aires", "slug": "caba" },
  "fechaInicio": "2026-12-01T03:00:00.000Z",
  "fechaFin": "2026-12-07T03:00:00.000Z",
  "presupuesto": "150000.00",   // string (Prisma Decimal)
  "moneda": "ARS",
  "createdAt": "2026-11-10T12:34:56.789Z",
  "updatedAt": "2026-11-10T12:34:56.789Z"
}
```

- `presupuesto` llega como **string** porque Prisma lo devuelve como `Decimal` y su `toJSON` es texto.
- `fechaInicio`/`fechaFin` son timestamps ISO‑8601 (midnight UTC).
- `destino` incluye solo `id`, `nombre` y `slug`.

---

## Cambios implementados en esta funcionalidad (F2-01)

| Archivo | Acción |
|---|---|
| `apps/api/src/modules/viajes/viajes.dto.ts` | **Creado** — DTOs `CrearViajeDto` y `ActualizarViajeDto` con validaciones `class-validator` y `PartialType`. |
| `apps/api/src/modules/viajes/viajes.service.ts` | **Creado** — Servicio con métodos `listar`, `obtener`, `crear`, `actualizar`, `eliminar`. Lógica de aislamiento por `usuarioId`, validación de rango de fechas y existencia de destino. |
| `apps/api/src/modules/viajes/viajes.controller.ts` | **Creado** — Controlador con rutas `GET/POST /viajes`, `GET/PATCH/DELETE /viajes/:id`, usando `JwtAuthGuard` y `ParseUUIDPipe`. |
| `apps/api/src/modules/viajes/viajes.module.ts` | **Creado** — Módulo que importa `AuthModule` (para el guard) y declara controller + service. |
| `apps/api/src/app.module.ts` | **Modificado** — Se importó y registró `ViajesModule` (una línea). |
| `apps/api/src/modules/viajes/README.md` | **Modificado** — Dueña actualizada a “Luz Vazquez” y checklist de definición de terminado actualizado. |
| `apps/api/src/modules/itinerario/README.md` | **Modificado** — Dueña actualizada a “Luz Vazquez” (mismo responsable F2). |
| `docs/api.md` | **Modificado** — Se añadió la sección completa “F2 · Viajes (F2-01)” con descripción de endpoints, cuerpos, respuestas y códigos de error. |
| `package.json` (api) | **Sin cambios** — No se necesitó añadir nuevas dependencias; ya estaban `class-validator`, `class-transformer`, `@nestjs/mapped-types`. |

### Resumen técnico
- **Autenticación:** `JwtAuthGuard` (cookie `token`, 24 h de vencimiento). Las rutas de viajes usan solo el guard, sin `RolesGuard` (cualquier usuario logueado puede crear/ver/editar/borrar sus propios viajes).
- **Aislamiento:** todo endpoint de viaje filtra por `usuarioId` obtenido del token (`@CurrentUser()`). Viajes ajenos responden **404**.
- **Validación:** `ValidationPipe` global (`whitelist: true, forbidNonWhitelisted: true, transform: true`) + validaciones `class-validator` en DTOs.
- **Base de datos:** Prisma ORM sobre PostgreSQL (en este proyecto, Supabase). El schema ya tenía `Viaje`, `Destino`, `ItinerarioItem` y `Gasto`; no fue necesario agregar columnas nuevas.
- **Cascade:** borrar un viaje elimina sus `ItinerarioItem` y `Gasto` automáticamente por definición del esquema (`onDelete: Cascade`).

## F3 · Catálogo de actividades (F3-01)

### Resumen
CRUD del catálogo de actividades. Cualquier usuario logueado puede listarlo; solo el ADMIN crea, edita y elimina. Si la actividad ya está en algún itinerario, el borrado la archiva (`activa = false`) en lugar de eliminarla. Los viajeros solo ven las actividades activas.

### Endpoints

#### `GET /actividades` — Listar el catálogo
- **Acceso:** logueado.
- **Filtros opcionales (query):** `destinoId` (uuid), `tipo` (`INTERIOR`, `EXTERIOR` o `MIXTA`) y `activa` (`true` o `false`; solo tiene efecto para el ADMIN, los viajeros siempre reciben las activas).
- **Aclaraciones:** Un viajero nunca recibe actividades archivadas, aunque envíe ?activa=false.
- **Respuesta (200):** lista ordenada por nombre.
  ```json
  [
  {
    "id": "uuid",
    "destinoId": "uuid",
    "nombre": "Actividad con coordenadas",
    "descripcion": "Texto de prueba",
    "tipo": "EXTERIOR",
    "categoria": null,
    "direccion": null,
    "latitud": -34.6037,
    "longitud": -58.3816,
    "fuente": null,
    "fuenteId": null,
    "relevadoEn": null,
    "activa": true,
    "creadoEn": "2026-11-13T23:38:43.878Z"
  }
  ]
  ```
- **Errores:** **400** si un filtro es inválido, **401** sin sesión válida.

#### `POST /actividades` — Crear una actividad
- **Acceso:** solo ADMIN.
- **Cuerpo (201):**
  ```json
  { "destinoId": "uuid", "nombre": "Museo de ejemplo", "tipo": "INTERIOR", "direccion": "Calle 123", "descripcion": "Texto corto" }
  ```
- **Validaciones:** `destinoId` y `nombre` y `tipo` obligatorios; `nombre` hasta 150 caracteres, `descripcion` hasta 1000, `categoria` hasta 100, `direccion` hasta 200; `latitud` y `longitud` dentro de rango. No se aceptan campos que no estén en esta lista (por ejemplo `fuente` o `fuenteId`).
- **Errores:** **400** si los datos son inválidos o el destino no existe, **401**, **403** si el rol no es ADMIN.

#### `PATCH /actividades/:id` — Editar una actividad
- **Acceso:** solo ADMIN.
- **Cuerpo:** los mismos campos de la creación, todos opcionales; se envía solo lo que cambia.
- **Respuesta (200):** la actividad actualizada.
- **Errores:** **400** (datos o `id` inválidos, destino inexistente), **401**, **403**, **404** si la actividad no existe.

#### `DELETE /actividades/:id` — Eliminar o archivar
- **Acceso:** solo ADMIN.
- **Comportamiento:** si la actividad está en algún itinerario, se archiva; si no, se elimina.
- **Respuesta (200):** `{ "id": "uuid", "accion": "archivada" }` o `{ "id": "uuid", "accion": "eliminada" }`.
- **Errores:** **400** si el `id` no es válido, **401**, **403**, **404** si no existe.