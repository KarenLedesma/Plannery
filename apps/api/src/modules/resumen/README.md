# Módulo resumen

- **Funcionalidad:** F5 · Resumen con IA
- **Dueña:** (completar)
- **Entidades que toca:** Viaje, ItinerarioItem, Gasto (lectura)
- **Depende de:** F1, F2, F4

## Endpoints
- `POST /viajes/:id/resumen`

## Reglas de acceso
- Solo el dueño del viaje.
- Usa `AiProvider` (`integrations/ia`). Se envían datos del viaje sin datos personales.
- La clave de IA solo vive en variables de entorno del backend. Manejo de errores y límite de uso.

## Definición de terminado
- [ ] Endpoints funcionando con validación de datos (DTOs)
- [ ] Respuestas 401, 403 y 404 correctas según corresponda
- [ ] Tests de autorización e IDs ajenos
- [ ] Endpoints documentados en `docs/api.md`
- [ ] La dueña puede explicar cada decisión de este módulo
