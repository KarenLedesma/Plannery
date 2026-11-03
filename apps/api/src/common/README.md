# common

Código compartido por todos los módulos. **Lo mantiene F1.** Si necesitás algo acá, pedilo o hacé un pull request chico.

Contenido previsto (F1):
- `guards/`: `JwtAuthGuard` (401 sin sesión válida) y `RolesGuard` (403 si el rol no corresponde).
- `decorators/`: `@CurrentUser()` y `@Roles(...)`.
- `filters/`: filtro de errores que nunca expone stack traces, consultas ni datos internos (R7).
