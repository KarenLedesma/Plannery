# Módulo gastos

- **Funcionalidad:** F4 · Gastos
- **Dueña:** (completar)
- **Entidades que toca:** Gasto, Viaje
- **Depende de:** F1, módulo viajes

## Endpoints
- `GET/POST /viajes/:id/gastos`, `PATCH/DELETE /viajes/:id/gastos/:gastoId`
- `GET /viajes/:id/gastos/comparacion`: estimado vs. real por categoría y fase

## Reglas de acceso
- Solo el dueño del viaje. Un gasto de un viaje ajeno responde 404.
- Los montos se manejan como Decimal, nunca como float.

## Definición de terminado
- [ ] Endpoints funcionando con validación de datos (DTOs)
- [ ] Respuestas 401, 403 y 404 correctas según corresponda
- [ ] Tests de autorización e IDs ajenos
- [ ] Endpoints documentados en `docs/api.md`
- [ ] La dueña puede explicar cada decisión de este módulo
