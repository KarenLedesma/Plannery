# 0003 · Servicios externos detrás de interfaces

**Decisión:** el pronóstico, la IA y la fuente del catálogo se usan a través de interfaces (`WeatherProvider`, `AiProvider`, `CatalogSource`) en `apps/api/src/integrations/`. El resto del código depende de la interfaz, no del servicio concreto.

**Por qué**
- Los servicios externos fallan, cambian sus condiciones o se vuelven pagos. Cambiar de proveedor tiene que ser escribir un adaptador, no reescribir módulos.
- Permite probar las reglas (por ejemplo, la recomendación según lluvia) con un proveedor falso, sin llamar a internet.
- Es el punto por donde el proyecto se puede ampliar: otra ciudad, otro servicio de IA, otra fuente de datos.

**Qué descartamos:** llamar a cada API directamente desde donde se necesita. Es más rápido al principio, pero ata todo el código al proveedor.

**Qué costo tiene:** un archivo más por integración y un poco de configuración para inyectar el proveedor.

**Qué contestar en la defensa:** "¿Qué pasa si Open-Meteo deja de ser gratis?" Se escribe un adaptador nuevo que cumpla `WeatherProvider` y se cambia en un solo lugar.
