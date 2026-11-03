# Módulo viajes

- **Funcionalidad:** F2 · Viajes e itinerario
- **Dueña:** (completar)
- **Entidades que toca:** Viaje, Destino
- **Depende de:** F1 (auth y guards)

## Endpoints
- `GET/POST /viajes`, `GET/PATCH/DELETE /viajes/:id`

## Reglas de acceso
- Toda consulta filtra por el usuario dueño. Un viaje ajeno responde 404, igual que si no existiera.

## Definición de terminado
- [ ] Endpoints funcionando con validación de datos (DTOs)
- [ ] Respuestas 401, 403 y 404 correctas según corresponda
- [ ] Tests de autorización e IDs ajenos
- [ ] Endpoints documentados en `docs/api.md`
- [ ] La dueña puede explicar cada decisión de este módulo
