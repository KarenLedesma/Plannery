# Módulo catalogo

- **Funcionalidad:** F3 · Catálogo y recomendaciones
- **Dueña:** (completar)
- **Entidades que toca:** Actividad, Destino
- **Depende de:** F1

## Endpoints
- `GET /actividades` (logueado)
- `POST/PATCH /actividades`, `DELETE /actividades/:id` (solo ADMIN)

## Reglas de acceso
- Escritura solo ADMIN (403 para VIAJERO).
- Si la actividad está en algún itinerario, el borrado la archiva (`activa = false`) en vez de eliminarla.

## Definición de terminado
- [ ] Endpoints funcionando con validación de datos (DTOs)
- [ ] Respuestas 401, 403 y 404 correctas según corresponda
- [ ] Tests de autorización e IDs ajenos
- [ ] Endpoints documentados en `docs/api.md`
- [ ] La dueña puede explicar cada decisión de este módulo
