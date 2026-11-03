# Endpoints

Cada dueña completa su sección al terminar la funcionalidad (hay una tarea de Trello para eso).

| Método y ruta | Acceso | Funcionalidad | Estado |
|---|---|---|---|
| `POST /auth/register` | público | F1 | pendiente |
| `POST /auth/login` | público | F1 | pendiente |
| `POST /auth/logout` | público | F1 | pendiente |
| `GET /auth/me` | logueado | F1 | pendiente |
| `GET /viajes`, `POST /viajes` | logueado | F2 | pendiente |
| `GET/PATCH/DELETE /viajes/:id` | dueño | F2 | pendiente |
| `GET/POST /viajes/:id/itinerario` | dueño | F2 | pendiente |
| `PATCH/DELETE /viajes/:id/itinerario/:itemId` | dueño | F2 | pendiente |
| `GET /actividades` | logueado | F3 | pendiente |
| `POST/PATCH/DELETE /actividades` | solo ADMIN | F3 | pendiente |
| `GET /viajes/:id/recomendaciones` | dueño | F3 | pendiente |
| `GET/POST /viajes/:id/gastos` | dueño | F4 | pendiente |
| `PATCH/DELETE /viajes/:id/gastos/:gastoId` | dueño | F4 | pendiente |
| `GET /viajes/:id/gastos/comparacion` | dueño | F4 | pendiente |
| `POST /viajes/:id/resumen` | dueño | F5 | pendiente |
