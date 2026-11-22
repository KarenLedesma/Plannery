# Módulo resumen

- **Funcionalidad:** F5 · Resumen con IA
- **Dueña:** Luz Vázquez
- **Entidades que toca:** `Viaje`, `ItinerarioItem`, `Gasto` (lectura); `UsuarioIaConfig` (lectura/escritura)
- **Depende de:** F1, F2, F4

## Endpoints

### Gestión de API Key del usuario (BYOK)
- `GET /ia/config` — Consulta si el usuario tiene una API Key configurada, el proveedor seleccionado y una máscara con los últimos 4 caracteres (nunca devuelve la clave en texto plano).
- `PUT /ia/config` — Crea o actualiza la API Key del usuario (se cifra antes de persistirse en la base de datos).
- `DELETE /ia/config` — Elimina definitivamente la API Key configurada del usuario.

### Generación de resumen
- `POST /viajes/:id/resumen` — Genera un resumen del viaje (itinerario y balance de gastos estimado vs. real) utilizando la API Key propia del usuario autenticado.

## Reglas de acceso y seguridad
- **Aislamiento de datos:** Solo el dueño del viaje puede generar su resumen (`403` si pertenece a otro usuario, `404` si no existe), y cada usuario solo puede consultar, editar o eliminar su propia configuración de IA.
- **Esquema BYOK (*Bring Your Own Key*):** En lugar de una única clave global compartida en el servidor, cada usuario gestiona su propia credencial de proveedor de IA (ej. Gemini, OpenAI o Groq).
- **Cifrado en reposo (AES-256-GCM):** Las API Keys se cifran en el backend mediante AES-256-GCM utilizando la clave maestra `IA_ENCRYPTION_KEY` (variable de entorno del servidor) y un IV único por registro antes de guardarse en `usuarios_ia_config`.
- **Privacidad en la integración:** Usa `AiProvider` (`integrations/ia`). Se envían únicamente los datos operativos del viaje (destino, fechas, actividades y gastos) sin datos personales del usuario.
- **Manejo de errores:** Contempla ausencia de API Key configurada (`400`), clave inválida o sin permisos en el proveedor (`401`/`403` del servicio externo), exceso de cuota (`429`) y timeouts de red.

## Definición de terminado
- [ ] Endpoints de configuración de API Key (`GET`, `PUT`, `DELETE`) y generación de resumen (`POST`) funcionando con validación de datos (DTOs)
- [ ] Cifrado AES-256-GCM implementado sin exposición de claves en texto plano en respuestas ni logs
- [ ] Respuestas 400, 401, 403, 404 y errores de proveedor externo manejados correctamente
- [ ] Tests de autorización, aislamiento de credenciales e IDs ajenos
- [ ] Endpoints documentados en `docs/api.md` y decisión BYOK documentada en `docs/decisiones/`
- [ ] La dueña puede explicar cada decisión de este módulo