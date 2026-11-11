# Módulo itinerario

- **Funcionalidad:** F2 · Viajes e itinerario
- **Dueña:** Luz Vazquez
- **Entidades que toca:** ItinerarioItem, Actividad, Viaje
- **Depende de:** F1, módulo viajes, catálogo cargado (F3)

## Endpoints
- `GET /viajes/:id/itinerario`
- `POST /viajes/:id/itinerario`, `PATCH/DELETE /viajes/:id/itinerario/:itemId`

## Reglas de acceso
- Solo el dueño del viaje.
- La fecha debe estar dentro del viaje y la actividad debe estar activa y ser del mismo destino.

## Definición de terminado
- [ ] Endpoints funcionando con validación de datos (DTOs)
- [ ] Respuestas 401, 403 y 404 correctas según corresponda
- [ ] Tests de autorización e IDs ajenos
- [ ] Endpoints documentados en `docs/api.md`
- [ ] La dueña puede explicar cada decisión de este módulo
