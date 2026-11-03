# Tareas

Reparto del trabajo en funcionalidades. Cada una tiene su carpeta en el backend (`apps/api/src/modules/`) y en el frontend (`apps/web/src/features/`), y quien la toma hace las dos partes. El checklist de cada tarjeta está en Trello; las reglas de Git, en `docs/flujo-de-trabajo.md`.

**Flujo:** rama `feature/<código>-<nombre>` desde `develop`, pull request hacia `develop`, commits en inglés. Las tareas **chica** son cortas.

## Reparto

| Persona | Funcionalidad | Consideraciones |
|---|---|---|
| 1 | F1 · Cimientos y cuentas | Arranca primera: F1-01 a F1-04 desbloquean a todas las demás. |
| 2 | F2 · Viajes e itinerario | Depende de F1-04. El itinerario (F2-02) necesita el catálogo (F3-01). |
| 3 | F3 · Catálogo y recomendaciones | Es la más pesada: F3-02 (importación) la toma la persona 5. |
| 4 | F4 · Gastos | Depende de F2-01. |
| 5 | F5 · Resumen con IA + F6 | F5 arranca tarde (depende de F2 y F4). Mientras tanto: F5-01, F3-02 y las tareas chica de F0. |

Mientras F1 no esté lista se puede avanzar con: F3-03 (adaptador de clima), F5-01 (elegir servicio de IA), el diseño de pantallas y todas las F0.

## F0 · Acuerdos del equipo

| Código | Tarea | Depende de |
|---|---|---|
| F0-01 | Revisar y aprobar el esquema de Prisma *(chica)* | — |
| F0-02 | Acordar flujo de Git y convención de commits *(chica)* | — |
| F0-03 | Corregir la documentación existente *(chica)* | — |
| F0-04 | Verificar condiciones de proveedores y fuentes *(chica)* | — |
| F0-05 | Repartir F1 a F5 y registrar dueñas *(chica)* | F0-01 |

## F1 · Cimientos y cuentas

| Código | Tarea | Depende de |
|---|---|---|
| F1-01 | Armar el monorepo y la app web | F0-01 |
| F1-02 | Base de datos en la nube y primera migración | F0-01 |
| F1-03 | Módulo auth: registro, login, logout y /auth/me | F1-02 |
| F1-04 | Guards, decoradores y filtro de errores comunes | F1-03 |
| F1-05 | Seed: admin, viajero y destino Ciudad de Buenos Aires | F1-02 |
| F1-06 | Frontend: login, registro, sesión y rutas protegidas | F1-01, F1-03 |
| F1-07 | Primer deploy (hito 2) | F1-04, F1-06 |
| F1-08 | Tests de autenticación y autorización (plantilla) | F1-04 |

## F2 · Viajes e itinerario

| Código | Tarea | Depende de |
|---|---|---|
| F2-01 | Backend: CRUD de viajes con aislamiento de datos | F1-04 |
| F2-02 | Backend: itinerario por día | F2-01, F3-01 |
| F2-03 | Frontend: lista y formulario de viajes | F1-06, F2-01 |
| F2-04 | Frontend: itinerario por día | F2-02, F2-03 |
| F2-05 | Tests de viajes e itinerario | F2-02 |
| F2-06 | Documentar F2 *(chica)* | F2-02 |

## F3 · Catálogo y recomendaciones

| Código | Tarea | Depende de |
|---|---|---|
| F3-01 | Backend: CRUD del catálogo de actividades (solo ADMIN) | F1-04 |
| F3-02 | Importar datos abiertos de CABA al catálogo | F1-05 |
| F3-03 | Adaptador de clima con Open-Meteo | F1-01 |
| F3-04 | Backend: recomendaciones según el pronóstico | F3-01, F3-03, F2-01 |
| F3-05 | Frontend: administración del catálogo | F1-06, F3-01 |
| F3-06 | Frontend: recomendaciones en el itinerario | F2-04, F3-04 |
| F3-07 | Tests de F3 | F3-04 |
| F3-08 | Documentar fuentes, licencias y regla de recomendación *(chica)* | F3-04 |

## F4 · Gastos

| Código | Tarea | Depende de |
|---|---|---|
| F4-01 | Backend: CRUD de gastos (bitácora de gastos) | F2-01 |
| F4-02 | Backend: comparación estimado vs. real | F4-01 |
| F4-03 | Frontend: bitácora de gastos | F1-06, F4-01 |
| F4-04 | Frontend: vista de estimado vs. real | F4-02, F4-03 |
| F4-05 | Tests y documentación de F4 | F4-02 |

## F5 · Resumen con IA

| Código | Tarea | Depende de |
|---|---|---|
| F5-01 | Elegir el servicio de IA y justificarlo *(chica)* | F0-04 |
| F5-02 | Adaptador de IA y manejo de errores | F5-01, F1-01 |
| F5-03 | Backend: endpoint de resumen del viaje | F5-02, F2-02, F4-02 |
| F5-04 | Frontend: botón de resumen | F5-03, F4-04 |
| F5-05 | Completar la declaración de uso de IA *(chica)* | — |

## F6 · Cierre y entrega

| Código | Tarea | Depende de |
|---|---|---|
| F6-01 | README completo y checklist de entrega *(chica)* | F1-07 |
| F6-02 | Video de demostración *(chica)* | F1-07 |
| F6-03 | Ensayo de defensa | — |

