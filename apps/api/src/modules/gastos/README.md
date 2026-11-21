# Módulo gastos

- **Funcionalidad:** F4 · Gastos (bitácora de gastos del viaje)
- **Entidades que toca:** Gasto, Viaje (solo para verificar el dueño)
- **Depende de:** F1 (auth y guards), módulo viajes

## Endpoints
Todos requieren sesión (401 sin cookie válida) y cuelgan de un viaje propio.

| Método y ruta | Qué hace |
|---|---|
| `GET /viajes/:viajeId/gastos` | Lista los gastos del viaje. Filtros opcionales: `?fase=ANTES&categoria=COMIDA` |
| `POST /viajes/:viajeId/gastos` | Crea un gasto |
| `PATCH /viajes/:viajeId/gastos/:gastoId` | Edita un gasto (por ejemplo, para cargar el monto real) |
| `DELETE /viajes/:viajeId/gastos/:gastoId` | Borra un gasto |

**Valores permitidos:**
- `categoria`: `TRANSPORTE`, `ALOJAMIENTO`, `COMIDA`, `ACTIVIDADES`, `OTROS`
- `fase`: `ANTES`, `DURANTE`, `DESPUES`

**Ejemplo de creación:**
```json
{
  "descripcion": "Pasaje de colectivo",
  "categoria": "TRANSPORTE",
  "fase": "ANTES",
  "montoEstimado": 12000.5
}
```
`montoReal`, `fecha` (AAAA-MM-DD) y `nota` son opcionales. `montoReal` queda vacío hasta que el gasto se hace efectivo.

## Reglas de acceso
- Antes de cualquier operación se verifica que el viaje sea del usuario. Un viaje ajeno responde **404**, igual que si no existiera.
- Un gasto se busca siempre dentro de ese viaje: no se puede tocar un gasto de otro viaje cambiando el id.
- Los montos se guardan como `Decimal(12,2)`, no como float, para que los totales cierren. Se devuelven como número.
- Los datos se validan en el backend (DTO): montos de 0 a 999999999 con 2 decimales como máximo, categoría y fase del listado permitido y campos desconocidos rechazados.

## Definición de terminado
- [x] Endpoints funcionando con validación de datos (DTOs)
- [x] Respuestas 401 sin sesión y 404 con viaje o gasto ajeno
- [ ] Tests de autorización e IDs ajenos
- [ ] Endpoints documentados en `docs/api.md`
- [ ] La dueña puede explicar cada decisión de este módulo
