# 0001 · Un solo backend dividido en módulos, dentro de un monorepo

**Decisión:** el backend es una sola aplicación NestJS con un módulo por funcionalidad, y frontend y backend viven en el mismo repositorio (`apps/web` y `apps/api`, gestionados con pnpm).

**Por qué**
- Somos pocas personas y poco tiempo: una sola aplicación se despliega, se prueba y se depura más fácil que varios servicios.
- Los módulos de NestJS nos dan límites claros: cada integrante trabaja en su carpeta sin tocar la de otra.
- Con un monorepo, un cambio en la API y su pantalla van en el mismo pull request.

**Qué descartamos**
- *Microservicios:* más infraestructura, más deploys y problemas de red entre servicios que no necesitamos a este tamaño.
- *Repositorios separados:* obliga a coordinar versiones entre frontend y backend.

**Qué costo tiene**
- Si el proyecto crece mucho, separar un módulo en su propio servicio requiere trabajo. Los límites por módulo y las interfaces de integración están pensados para que ese trabajo sea chico.

**Qué contestar en la defensa:** "¿Por qué no microservicios?" Porque resuelven problemas de escala y de equipos grandes que no tenemos, y a cambio sumarían complejidad de despliegue.
