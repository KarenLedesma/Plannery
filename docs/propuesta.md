# Propuesta de proyecto: Plannery

> Borrador: pendiente de revisión del equipo.

**Equipo:** [Nombre Apellido], [Nombre Apellido], [Nombre Apellido]

## Problema

Planificar un viaje por Argentina obliga a juntar información dispersa: qué lugares visitar, cómo va a estar el clima en las fechas elegidas y cuánto se va a gastar. Es común descubrir tarde que las actividades al aire libre caen en días de lluvia, o perder el control del presupuesto antes, durante y después del viaje. Plannery permite armar un viaje por destino y fechas, recibir recomendaciones de actividades adaptadas al pronóstico, organizarlas en un itinerario por día y controlar los gastos comparando lo estimado con lo real en cada fase del viaje, con un resumen final generado con apoyo de IA.

## Usuarios y roles

**Viajero/a (usuario registrado).** Es quien planifica sus viajes. Puede crear, editar y eliminar sus propios viajes, ver recomendaciones según el clima de sus fechas, armar el itinerario por día, registrar gastos estimados y reales por categoría y por fase (antes, durante y después), y pedir el resumen del viaje. Solo accede a sus propios datos.

**Administrador/a.** Mantiene el catálogo de actividades que se recomiendan: puede crearlas, editarlas y eliminarlas. No necesita acceder a los viajes privados de los usuarios. Si un viajero intenta usar estas funciones, el backend responde 403.

## Alcance del MVP

**Qué entra en el MVP** (en orden de prioridad):

1. **Cuentas y roles.** Registro, inicio y cierre de sesión con sesión por cookie `httpOnly` con vencimiento, dos roles (viajero/a y administrador/a), rutas protegidas en el frontend y endpoints protegidos en el backend con respuestas 401 y 403.
2. **Viajes con itinerario por día.** CRUD completo de viajes (destino, que en el MVP es la Ciudad de Buenos Aires, fechas y presupuesto) y armado del itinerario por día, con aislamiento de datos: cada viajero ve solo lo suyo.
3. **Recomendaciones según el clima.** Para las fechas de un viaje, la aplicación consulta el pronóstico y recomienda, de un catálogo de lugares y actividades de la Ciudad de Buenos Aires, las que mejor se adaptan a cada día (interior en días de lluvia, exterior en días buenos).
4. **Gastos.** CRUD de gastos con monto estimado y monto real, por categoría y por fase del viaje (antes, durante y después), y una vista que compara lo gastado con el presupuesto.
5. **Administración del catálogo.** El administrador crea, edita y elimina las actividades del catálogo.
6. **Resumen del viaje con IA.** El backend envía a un modelo de IA los datos del viaje (itinerario y gastos, sin datos personales del usuario) y devuelve un resumen. [...]

**Si el tiempo aprieta**, se recorta de abajo hacia arriba: primero el resumen con IA (es recomendado, no obligatorio) y después se simplifican los gastos por fase.

**Fuera del MVP:** destinos fuera de la Ciudad de Buenos Aires, comparación de precios de vuelos y hoteles, eventos, reseñas, enlaces públicos para compartir viajes, conversión de moneda e inicio de sesión con Google o GitHub.

**Si sobra tiempo:** mapa interactivo y reseñas.

## Entidades principales

| Entidad | Descripción | Relaciones |
|---|---|---|
| **Usuario** | Persona registrada, con rol de viajero/a o administrador/a | Tiene muchos viajes |
| **Viaje** | Viaje planificado: destino, fechas y presupuesto | Pertenece a un usuario; tiene muchos ítems de itinerario y muchos gastos |
| **Actividad** | Lugar o actividad del catálogo, clasificada como interior, exterior o mixta | Puede estar en el itinerario de muchos viajes |
| **ItinerarioItem** | Asigna una actividad a un día de un viaje | Une un viaje con una actividad |
| **Gasto** | Gasto de un viaje, con categoría, fase (antes, durante o después), monto estimado y monto real | Pertenece a un viaje |

Cada viaje, y todo lo que cuelga de él, pertenece a un único usuario, y el backend verifica esa pertenencia en cada pedido.

## Stack tentativo

| Capa | Herramienta |
|---|---|
| Frontend | React |
| Backend | NestJS (Node.js) |
| Base de datos | PostgreSQL en la nube, con Prisma como ORM |
| Autenticación | JWT en cookie `httpOnly` con vencimiento; roles y permisos verificados en el backend |
| Deploy | Vercel (frontend) y Render (backend); base de datos en un servicio de PostgreSQL gestionado (a confirmar) |
| Gestor de paquetes | pnpm |
| APIs externas | Open-Meteo (pronóstico), datos abiertos de la Ciudad de Buenos Aires (lugares) y un servicio de IA para el resumen (a definir) |

La justificación de cada herramienta, con alternativas y costos, está en `docs/justificacion.md`.


## Riesgos

| Riesgo | Cómo lo encaramos |
|---|---|
| **Cookie de sesión entre dominios** (Vercel y Render): el navegador puede bloquear la cookie `httpOnly` como cookie de terceros. | Reenviar las llamadas a la API desde el dominio del frontend (reescritura en Vercel) y probarlo en el primer deploy (hito 2). |
| **Planes gratuitos**: el backend se suspende por inactividad y las bases gratuitas pueden suspenderse o vencer. | Verificar las condiciones del proveedor antes de elegirlo, avisar en el README del arranque lento, despertar el servicio antes de la defensa y grabar un video de respaldo. |
| **Alcance y coordinación**: seis funcionalidades conectadas y un esquema de base de datos compartido. | Definir el esquema inicial entre todo el equipo, usar ramas por funcionalidad y pull requests chicos con revisión cruzada, y recortar de abajo hacia arriba si el tiempo aprieta. |
| **Servicios y datos externos**: la API de la Ciudad tiene relevamientos antiguos y campos distintos por categoría, el pronóstico llega a pocos días, y el clima, la API y la IA pueden fallar. | Importar el catálogo una vez a la base propia, mostrar la fecha del relevamiento, avisar en la interfaz si las fechas superan el pronóstico, usar tiempos de espera y mensajes de error claros, y dejar la clave de IA solo en el backend. |
| **Autorización incorrecta**: un usuario no debe ver ni modificar datos ajenos. | Verificar la pertenencia en cada endpoint y escribir tests de 401, 403 e IDs ajenos desde las primeras rutas. |


**Repositorio:** [link al repositorio]