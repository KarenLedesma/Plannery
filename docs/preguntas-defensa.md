# Preguntas probables de la defensa

Cada integrante debe poder contestar estas preguntas sobre **cualquier parte** del proyecto, también la que escribió otra persona o la IA. Completar y ampliar entre todas.

| Pregunta | Dónde está la respuesta |
|---|---|
| ¿Cómo viaja un pedido desde el navegador hasta la base y vuelve? | `docs/arquitectura.md` |
| ¿Cómo protegen las contraseñas? | Hash con bcrypt, nunca texto plano. (F1) |
| ¿Qué pasa si llamo a un endpoint sin sesión? ¿Y con el rol equivocado? | 401 y 403. (F1, `docs/arquitectura.md`) |
| ¿Cómo evitan que un usuario vea el viaje de otro? | Filtro por dueño y 404. (`decisiones/0002`) |
| ¿Por qué ocultar un botón no alcanza como seguridad? | Se puede llamar al endpoint directo. El backend decide. |
| ¿Por qué PostgreSQL y no MongoDB? | `decisiones/0002`, `docs/justificacion.md` |
| ¿Por qué guardan el dinero como Decimal? | `docs/modelo-de-datos.md` |
| ¿Por qué no usan `localStorage` para el token? | `decisiones/0004` |
| ¿Qué pasa si Open-Meteo falla o deja de ser gratis? | `decisiones/0003` |
| ¿Cómo agregarían otra ciudad? | Una fila en `Destino` y su catálogo. (`docs/modelo-de-datos.md`) |
| ¿Qué datos le mandan a la IA? ¿Dónde está la clave? | Sin datos personales; la clave solo en el backend. (F5) |
| ¿Qué hizo la IA bien y qué tuvieron que corregir? | `docs/uso-de-ia.md` |
| ¿Qué parte te costó más y qué harías distinto? | Cada una prepara su respuesta. |
