# Módulo viajes

- **Funcionalidad:** F2 · Viajes e itinerario
- **Dueña:** Luz Vazquez
- **Entidades que toca:** Viaje, Destino
- **Depende de:** F1 (auth y guards)

## Endpoints
- `GET/POST /viajes`, `GET/PATCH/DELETE /viajes/:id`

## Reglas de acceso
- Toda consulta filtra por el usuario dueño. Un viaje ajeno responde 404, igual que si no existiera.

## Definición de terminado
- [x] Endpoints funcionando con validación de datos (DTOs)
- [x] Respuestas 401, 403 y 404 correctas según corresponda
- [ ] Tests de autorización e IDs ajenos *(F2-05)*
- [x] Endpoints documentados en `docs/api.md`
- [ ] La dueña puede explicar cada decisión de este módulo

## Decisiones
- El `usuarioId` se toma de la cookie; nunca del cuerpo del pedido.
- Un viaje ajeno responde 404, igual que si no existiera, para no revelar qué viajes hay.
- `PATCH` valida las dos fechas juntas, combinando lo que viene con lo que ya está en la base.
- La respuesta incluye `destino: { id, nombre, slug }` para que el frontend no tenga que pedirlo aparte.
