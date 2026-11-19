# Catálogo de actividades y recomendaciones según el clima (F3)

Este documento explica de dónde salen los datos del catálogo y del pronóstico, bajo qué condiciones se pueden usar, cómo decide la aplicación qué actividades recomendar y qué límites tiene.

## Fuentes de datos

| Dato | Fuente | Condiciones de uso |
|---|---|---|
| Pronóstico del clima | [Open-Meteo](https://open-meteo.com) (API gratuita, sin clave) | Uso no comercial, menos de 10.000 llamadas por día. Los datos están bajo licencia CC BY 4.0, que exige dar crédito. |
| Lugares de la Ciudad de Buenos Aires | API de datos abiertos de la Ciudad (BA Data) | La condición es citar la fuente original e indicar si se hicieron modificaciones. |

**Atribución.** El pronóstico se muestra con el crédito "Open-Meteo.com (CC BY 4.0)" en la pantalla de recomendaciones. Los lugares provienen de BA Data, Gobierno de la Ciudad de Buenos Aires.

**Modificaciones sobre los datos de la Ciudad.** No se importa el catálogo completo: se eligieron 30 lugares destacados a mano (`apps/api/prisma/data/catalogo-destacados.json`), se les escribió una descripción corta y se les asignó el tipo (interior, exterior o mixta), que la fuente no trae.

## Cómo se arma el catálogo

1. El administrador o la administradora corre una sola vez el script de importación, que lee el archivo de lugares destacados, consulta cada uno en la API de la Ciudad y lo guarda en nuestra base de datos.
2. La importación es **idempotente**: usa `upsert` sobre la pareja (`fuente`, `fuenteId`), así que correrla de nuevo no duplica actividades.
3. Desde ahí, el catálogo vive en nuestra base. La aplicación no depende de la API de la Ciudad para recomendar, y el administrador puede corregir, archivar o eliminar actividades (`/actividades`).

Para importar (después de correr el seed):

```bash
pnpm --filter api import:catalogo
```

## Regla de recomendación

Para cada día del viaje se clasifica el pronóstico y se filtran las actividades del catálogo. Los umbrales están definidos en un solo lugar: `apps/api/src/modules/recomendaciones/recomendaciones.rules.ts`.

**1. Clasificación del día** (se evalúa en este orden):

| Tipo de día | Condición |
|---|---|
| `EXTREMO` | temperatura máxima de 32 °C o más, o menor a 8 °C |
| `LLUVIOSO` | probabilidad de lluvia de 50 % o más |
| `BUENO` | cualquier otro caso |

El clima extremo se evalúa primero: con 35 °C y lluvia no se quiere recomendar un lugar mixto.

**2. Qué actividades convienen:**

| Tipo de actividad | Día `BUENO` | Día `LLUVIOSO` | Día `EXTREMO` |
|---|---|---|---|
| `INTERIOR` | sí | sí | sí |
| `MIXTA` | sí | sí | no |
| `EXTERIOR` | sí | no | no |

**3. Orden:** en un día bueno van primero las exteriores, luego las mixtas y luego las interiores. En los demás días, al revés: interiores, mixtas y exteriores.

La pantalla muestra las 5 primeras de cada día, con un botón "Ver todas".

## Límites conocidos

- **Pronóstico acotado.** Open-Meteo ofrece unos 16 días hacia adelante. Los días del viaje que superan ese rango se informan en `sinPronostico` y la pantalla avisa, en lugar de recomendar con datos inexistentes. Si el viaje es en un futuro más lejano, no hay recomendaciones.
- **Servicio externo.** Si Open-Meteo no responde en 5 segundos o falla, el endpoint responde 503 con un mensaje claro.
- **Datos antiguos.** Los relevamientos de la API de la Ciudad son de entre 2007 y 2012, por eso el catálogo se limita a lugares estables (museos, parques, teatros, mercados) y el administrador puede corregirlo.
- **Catálogo chico.** Son 30 lugares, todos de la Ciudad de Buenos Aires, el único destino del MVP.
- **Una regla simple.** Solo mira la probabilidad de lluvia y la temperatura máxima. No considera viento, humedad ni el horario de apertura de cada lugar.
- **Archivar en lugar de borrar.** Una actividad que ya está en algún itinerario se archiva (`activa = false`) en vez de eliminarse, para no romper viajes existentes.