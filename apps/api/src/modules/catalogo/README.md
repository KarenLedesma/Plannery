# Módulo catalogo

- **Funcionalidad:** F3 · Catálogo y recomendaciones
- **Dueña:** Agustina Rivoira
- **Entidades que toca:** Actividad, Destino
- **Depende de:** F1

## Endpoints
- `GET /actividades` (logueado)
- `POST/PATCH /actividades`, `DELETE /actividades/:id` (solo ADMIN)

## Reglas de acceso
- Escritura solo ADMIN (403 para VIAJERO).
- Si la actividad está en algún itinerario, el borrado la archiva (`activa = false`) en vez de eliminarla.
- Fuentes, licencias, regla del clima y límites: `docs/catalogo-y-recomendaciones.md`.

## Definición de terminado
- [x] Endpoints funcionando con validación de datos (DTOs)
- [x] Respuestas 401, 403 y 404 correctas según corresponda
- [x] Tests de autorización e IDs ajenos
- [x] Endpoints documentados en `docs/api.md`
- [x] La dueña puede explicar cada decisión de este módulo
