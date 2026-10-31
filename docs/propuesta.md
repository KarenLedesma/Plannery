# Propuesta de proyecto: Plannery

> Borrador: pendiente de revisión del equipo.

**Equipo:** [Nombre Apellido], [Nombre Apellido], [Nombre Apellido]

## Problema

Planificar un viaje por Argentina obliga a juntar información dispersa: qué lugares visitar, cómo va a estar el clima en las fechas elegidas y cuánto se va a gastar. Es común descubrir tarde que las actividades al aire libre caen en días de lluvia, o perder el control del presupuesto durante el viaje. Plannery permite armar un viaje indicando destino y fechas, recibir recomendaciones de lugares y actividades adaptadas al pronóstico, guardar las elegidas en una lista del viaje y llevar el control de los gastos frente al presupuesto.

## Usuarios y roles

**Viajero/a (usuario registrado).** Es quien planifica sus viajes. Puede crear, editar y eliminar sus propios viajes, ver recomendaciones según el clima de sus fechas, guardar actividades en la lista de cada viaje, registrar sus gastos y comparar lo gastado con su presupuesto. Solo accede a sus propios datos.

**Administrador/a.** Mantiene el catálogo de actividades y destinos que se recomiendan: puede crearlos, editarlos y eliminarlos. No necesita acceder a los viajes privados de los usuarios. Si un viajero intenta usar estas funciones, el backend responde 403.

## Alcance del MVP

**Qué entra en el MVP** (en orden de prioridad):

1. **Cuentas y roles.** Registro, inicio y cierre de sesión con sesión por cookie `httpOnly` con vencimiento, dos roles (viajero/a y administrador/a), rutas protegidas en el frontend y endpoints protegidos en el backend con respuestas 401 y 403.
2. **Viajes.** CRUD completo de viajes (destino, fechas y presupuesto), con aislamiento de datos: cada viajero ve solo los suyos.
3. **Recomendaciones según el clima.** Para las fechas de un viaje, la aplicación consulta el pronóstico y recomienda, de un catálogo de lugares y actividades de la Ciudad de Buenos Aires, las que mejor se adaptan a cada día (actividades de interior en días de lluvia, de exterior en días buenos).
4. **Lista del viaje.** El viajero guarda las actividades elegidas en su viaje y las organiza por día.
5. **Gastos y presupuesto.** CRUD de gastos por categoría y una vista que compara lo gastado con el presupuesto del viaje.
6. **Administración del catálogo.** El administrador crea, edita y elimina las actividades del catálogo.

**Qué queda fuera del MVP:**

- Destinos fuera de la Ciudad de Buenos Aires.
- Comparación de precios de vuelos, hoteles y paquetes de agencias.
- Eventos y festivales.
- Reseñas y moderación de reseñas.
- Compartir un viaje mediante un enlace público.
- Conversión de moneda.
- Inicio de sesión con Google o GitHub y recuperación de contraseña.

**Si el tiempo alcanza** (en este orden): mapa interactivo con la ubicación de las actividades, reseñas y una funcionalidad con IA.

## Entidades principales

(pendiente)

## Stack tentativo

(pendiente)

## Riesgos

(pendiente)

**Repositorio:** [link al repositorio]