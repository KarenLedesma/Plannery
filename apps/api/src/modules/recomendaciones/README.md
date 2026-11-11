# Módulo recomendaciones

- **Funcionalidad:** F3 · Catálogo y recomendaciones
- **Dueña:** (completar)
- **Entidades que toca:** Actividad, Viaje (lectura)
- **Depende de:** F1, módulo viajes, catálogo

## Endpoints
- `GET /viajes/:id/recomendaciones`: por día, actividades según el pronóstico

## Reglas de acceso
- Solo el dueño del viaje.
- Usa `WeatherProvider` (`integrations/clima`). Avisa si las fechas superan el alcance del pronóstico.

## Definición de terminado
- [ ] Endpoints funcionando con validación de datos (DTOs)
- [ ] Respuestas 401, 403 y 404 correctas según corresponda
- [ ] Tests de autorización e IDs ajenos
- [ ] Endpoints documentados en `docs/api.md`
- [ ] La dueña puede explicar cada decisión de este módulo
