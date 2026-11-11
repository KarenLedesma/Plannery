# 0004 · Sesión con JWT en cookie httpOnly

**Decisión:** al iniciar sesión el backend entrega un JWT con vencimiento en una cookie `httpOnly`. El frontend llama a `/api` en su propio dominio (reescritura en Vercel hacia Render), para que la cookie sea del mismo sitio.

**Por qué**
- `httpOnly` impide que un script del navegador lea el token.
- Un JWT no necesita guardar sesiones en el servidor.
- La reescritura evita el problema de las cookies de terceros entre dos dominios.

**Qué descartamos:** guardar el token en `localStorage` (cualquier script de la página lo podría leer), un proveedor externo como Clerk o Auth0 (el enunciado valora implementar roles y verificación propia) y sesiones en el servidor (más estado que mantener).

**Qué costo tiene:** no se puede revocar un token antes de que venza. Se acota con un vencimiento corto. Hay que configurar bien CORS y `SameSite`, y probarlo en el primer deploy.

**Qué contestar en la defensa:** "¿Por qué no `localStorage`?" Porque un ataque XSS podría robar el token. Con `httpOnly` el script no puede leerlo.
