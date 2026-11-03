# Flujo de trabajo del equipo

## Ramas
- `main`: lo que se puede mostrar y defender. Solo se actualiza desde `develop` cuando algo está estable.
- `develop`: integración. Acá se juntan las funcionalidades.
- `feature/F2-03-formulario-viajes`: una rama por tarea, siempre salida de `develop`. Se nombra con el código de la tarjeta de Trello.

## Pull requests
1. Abrir el PR hacia `develop` con el código de la tarea en el título.
2. **Lo revisa otra persona**, nunca quien lo escribió.
3. Antes de pedir revisión, actualizar la rama con `develop` y probar que todo siga funcionando.
4. PR chicos: una tarea, un PR.

## Commits
Acordar una convención única para todo el equipo. Propuesta: Conventional Commits en inglés (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).

## Cómo no pisarse
| Qué | Quién lo toca |
|---|---|
| `apps/api/src/modules/<funcionalidad>/` y `apps/web/src/features/<funcionalidad>/` | Solo la dueña de esa funcionalidad |
| `apps/api/src/common/` y `apps/web/src/shared/` | F1. Las demás piden cambios por PR chico |
| `apps/api/src/app.module.ts` | Todas, pero con una sola línea |
| `apps/api/prisma/schema.prisma` | Por PR propio, avisando al equipo, revisado por todas |
| `docs/` | Cada una documenta su parte en su archivo |

### Reglas del esquema de Prisma
- Una migración ya fusionada **no se edita**: se crea otra.
- Si dos PR agregan migraciones a la vez, la segunda actualiza su rama y vuelve a generar la suya.
- Tras cada cambio de esquema: `pnpm --filter api prisma:migrate` y avisar al equipo para que actualice su base local.

## Participación de todos
El enunciado exige commits de cada integrante a lo largo del proyecto, y que cada una pueda explicar su trabajo en la defensa. Las tareas de Trello marcadas **chica** sirven para quien tiene poco tiempo y quiere dejar su aporte en el historial.
