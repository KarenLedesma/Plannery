# Módulo auth

- **Funcionalidad:** F1 · Cimientos y cuentas
- **Dueña:** (completar)
- **Entidades que toca:** Usuario
- **Depende de:** -

## Endpoints
- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`

## Reglas de acceso
- Registro público siempre crea VIAJERO. Solo un ADMIN puede tener ese rol (se asigna por seed o desde la base).
- Contraseña con hash, cookie httpOnly con vencimiento.

## Definición de terminado
- [ ] Endpoints funcionando con validación de datos (DTOs)
- [ ] Respuestas 401, 403 y 404 correctas según corresponda
- [ ] Tests de autorización e IDs ajenos
- [ ] Endpoints documentados en `docs/api.md`
- [ ] La dueña puede explicar cada decisión de este módulo
