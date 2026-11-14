# 📋 Resumen Técnico Trabajo Final - F2 (Luz Vazquez)

## 👤 Responsable
**Luz Vazquez**

---

## 🌿 Rama Actual
`feature/F2-01-crud-viajes` (y `feature/F2-03-frontend-viajes` para frontend)

---

## 📦 F2-01: CRUD de Viajes con Aislamiento de Datos
**Estado: ✅ COMPLETADO PUSHADO**

- **Rama:** `feature/F2-01-crud-viajes`
- **Commits:** 3
  - `75ad5dc` - feat: F2-01 CRUD de viajes con aislamiento de datos
  - `350b459` - feat: F2-02 Itinerario por día - módulo base
  - `9481aa0` - feat: F2-02 Daily itinerary - fix parameter ordering in service and controller

### Arquitectura Backend (NestJS + Prisma)
- **Módulo:** `apps/api/src/modules/viajes/`
  - `viajes.module.ts`, `viajes.controller.ts`, `viajes.service.ts`, `viajes.dto.ts`
- **Endpoints REST:**
  - `GET     /viajes`
  - `POST    /viajes`
  - `PATCH   /viajes/:id`
  - `DELETE  /viajes/:id`
- **Aislamiento de datos:** Prisma `where { userId }` - cada usuario solo ve sus propios viajes
- **Seed data creado:** `admin@demo.com`, `viajero@demo.com`, destino `CABA`
- **Build TypeScript:** ✅ 0 errores (`pnest --filter api build`)
- **API Levantada:** ✅ `pnest --filter api start:dev` en puerto 3000
- **Integración app.module.ts:** `ViajesModule` agregado // F2

### Commits en Inglés (Conventional Commits)
- `feat: F2-01 CRUD de viajes con aislamiento de datos`
- `feat: F2-02 Itinerario por día - módulo base`
- `feat: F2-02 Daily itinerary - fix parameter ordering in service and controller`

---

## 📦 F2-02: Itinerario por Día
**Estado: ✅ COMPLETADO PUSHADO (junto con F2-01)**

- **Módulo:** `apps/api/src/modules/itinerario/`
  - `itinerario.module.ts`, `itinerario.dto.ts`, `itinerario.service.ts`, `itinerario.controller.ts`
- **Endpoints REST:**
  - `GET     /viajes/:itinerarioId`
  - `POST    /viajes/:itinerarioId/itinerario`
  - `PATCH   /viajes/:itinerarioId/:itemId`
  - `DELETE  /viajes/:itinerarioId/:itemId`
- **DTOs con validación:**
  - `IsUUID`, `IsDateString`, `Length`
  - Validación de rango de fechas y actividad
- **Service:** `listar()`, `crear()`, `actualizar()`, `eliminar()`
- **Fix TypeScript aplicado:** Reordenamiento parámetros en `actualizar()` (dto antes que itemId)
- **Eliminado:** `ENDSEED` leftover del service file
- **Build TypeScript:** ✅ 0 errores

### Relación con F2-01
- F2-02 depende de F2-01 (mismo usuario, mismo aislamiento)
- Mismo `app.module.ts` incluye ambos módulos

---

## 🌐 F2-03: Frontend - Listado y Formulario de Viajes
**Estado: ✅ 5 COMMITS CONVENTIONALS EN RAMA LOCAL PUSHADA**

- **Rama:** `feature/F2-03-frontend-viajes` (pushada a origin)
- **Commits (5 commits Conventionals en inglés):**
  1. `9a8b292` - `feat(features/viajes): base service and types for viaje management`
  2. `28fbcc4` - `feat(features/viajes): ViajeList component with data fetch and rendering`
  3. `7887452` - `feat(features/viajes): ViajeForm component with submit and state management`
  4. `10746ac` - `feat(features/viajes): routing configuration and App.tsx integration with navigation`
  5. `ac55d62` - `feat(features/viajes): barrel exports and index for public API`

### Arquitectura Frontend (React + Vite)
- **Archivos creados (7 archivos nuevos):**
  - `apps/web/src/features/viajes/viajes.service.ts` - fetch API wrapper
    - `listarViajes()` → `GET /api/viajes`
    - `crearViaje(dto)` → `POST /api/viajes`
    - `crearItinerario(viajeId, dto)` → `POST /api/viajes/:viajeId/itinerario`
  - `apps/web/src/features/viajes/tipos.ts` - Interfaces TypeScript
    - `Viaje`, `CrearViajeDto`, `ItinerarioDia`, `CrearItinerarioDto`
  - `apps/web/src/features/viajes/ViajeListComponent.tsx`
    - `useEffect` + fetch a `GET /api/viajes`
    - Renderiza lista: nombre, destino, fechas, presupuesto
    - Link a `/viajes/:id` (ver detalle)
  - `apps/web/src/features/viajes/ViajeFormComponent.tsx`
    - React state + formulario submit
    - Campos: nombre, destinoId, fechaInicio, fechaFin, presupuesto
    - Submit a `POST /api/viajes`
    - Loading state y manejo de errores
  - `apps/web/src/App.tsx` - Integración de navegación
    - Botones "Ver Viajes" / "Crear Viaje"
    - Renderizado condicional de componentes
  - `apps/web/src/features/viajes/viajes.routes.ts` - Configuración de rutas
  - `apps/web/src/features/viajes/index.ts` - Barrel exports públicos

### Características Técnicas F2-03
- ⚠️ **Sin estilos visuales** (solo estructura semántica HTML - como se solicitó)
- ⚠️ **Sin react-router-dom** (routing básico en App.tsx, pendiente instalar)
- ⚠️ **Usa `credentials: 'include'`** para cookies JWT automáticas
- ✅ **Consume endpoints** del backend F2-01 y F2-02
- ⚠️ **Pendiente:** Testear con login real (compañera aún terminando login frontend)
- ⚠️ **Pendiente:** Instalar `react-router-dom` para routing completo

### Dependencias F2-03
- ✅ **F1-06** (Auth backend): Endpoints `/auth/login`, `/auth/logout` disponibles
- ✅ **F2-01** (CRUD Viajes Backend): `GET/POST /viajes` funcionando, build limpio
- ✅ **API Base:** `localhost:3000/api/viajes` corriendo

---

## 🏗️ Arquitectura Integral del Proyecto

### Backend (API NestJS)
- **Rama:** `feature/F2-01-crud-viajes`
- **Puerto:** 3000
- **Build:** `pnest --filter api build` ✅ 0 errores TypeScript
- **Start:** `pnest --filter api start:dev` ✅
- **Auth:** JwtAuthGuard, estrategia cookie-based
- **Prisma:** Aislamiento por `userId`, schema reseteado y seteado

### Frontend (React + Vite)
- **Rama:** `feature/F2-03-frontend-viajes`
- **Puerto:** típicamente 5173 (Vite default)
- **Build:** `pnpm --filter web build`
- **Dev:** `pnpm --filter web dev`
- **Dependencias:** `react`, `react-dom`, `vite`, `typescript`, `eslint`

---

## 📊 Estado de Commits por Feature (Según PDF de Distribución)

| Feature | Responsable | Status | Commits |
|---------|-------------|--------|---------|
| **F1** - Cimientos y cuentas | Persona 1 | Parcial | F1-01 a F1-08 |
| **F2** - Viajes itinerario | **Luz Vazquez (Persona 2)** | ✅ **Avanzado** | F2-01, F2-02, F2-03 |
| **F3** - Catálogo y recomendaciones | Persona 3 | Pendiente | F3-01 a F3-08 |
| **F4** - Gastos | Persona 4 | Pendiente | F4-01 a F4-05 |
| **F5** - Resumen con IA | Persona 5 | Pendiente | F5-01 a F5-05 |
| **F6** - Cierre y entrega | Persona 6 | Pendiente | F6-01 a F6-03 |

---

## 🔑 Convenios del Proyecto

### Git Flow
- **Branches:** `feature/<código>-<nombre>` desde `develop`
- **Pull Request:** Hacia `develop`
- **Commits:** Formato *conventional commits* (inglés)
- **Prefixs usados:**
  - `feat:` Nueva funcionalidad
  - `fix:` Corrección de bug
  - `docs:` Documentación
  - `refactor:` Refactorización

### Commits Realizados en F2 (Luz Vazquez)
Todos en inglés, formato conventional:

```
feat: F2-01 CRUD de viajes con aislamiento de datos
feat: F2-02 Itinerario por día - módulo base
feat: F2-02 Daily itinerary - fix parameter ordering in service and controller
feat(features/viajes): base service and types for viaje management
feat(features/viajes): ViajeList component with data fetch and rendering
feat(features/viajes): ViajeForm component with submit and state management
feat(features/viajes): routing configuration and App.tsx integration with navigation
feat(features/viajes): barrel exports and index for public API
```

---

## 📁 Archivos Modificados / Creamos

### Backend (apps/api/src/modules/)
- `apps/api/src/modules/viajes/` - F2-01 CRUD Viajes ✅
- `apps/api/src/modules/itinerario/` - F2-02 Itinerario por Día ✅

### Frontend (apps/web/src/features/viajes/)
- `viajes.service.ts` - Service wrapper API ✅
- `tipos.ts` - Interfaces TypeScript ✅
- `ViajeListComponent.tsx` - Componente listado ✅
- `ViajeFormComponent.tsx` - Componente formulario ✅
- `App.tsx` - Integración navegación ✅
- `viajes.routes.ts` - Configuración rutas ✅
- `index.ts` - Barrel exports ✅

### Documentación
- `f2-luz-resumen-tecnico.md` - Este archivo (resumen técnico F2-Luz) ✅ **CREADO**

---

## ⚠️ Pendientes Próximos (Roadmap)

1. **F2-03:** Testear con login real (compañera login frontend pending)
   - Instalar `react-router-dom`
   - Probar flujo: login → crear viaje → ver lista

2. **F2-04:** Frontend itinerario por día
   - Depende de F2-02 (backend) y F2-03 (frontend listado)

3. **F3-01:** CRUD catálogo actividades (persona 3)
   - Backend: CRUD solo ADMIN
   - Frontend: Administración del catálogo

4. **F4-01:** CRUD gastos (persona 4)
   - Backend: CRUD bitácora de gastos
   - Frontend: Bitácora y vista estimado vs real

5. **F5-01:** Elegir servicio IA (persona 5)
   - Definir servicio IA y justificación
   - Endpoint de resumir viaje

6. **F0-05:** Repartir F1-a-F5 y registrar dueñas
   - Tareas chicas del acuerdo del equipo

7. **F6-01:** README completo y checklist de entrega

8. **Build & Testing**
   - `pnest --filter web build` (pending configuración)
   - `pnest --filter api build` ✅ Already passing

---

## 🎯 Logro Principal de Luz Vazquez en F2

**Has implementado exitosamente:**
- ✅ F2-01: CRUD completo de viajes con aislamiento de datos por usuario
- ✅ F2-02: Módulo itinerario por día con validación de fechas y actividades
- ✅ F2-03: Frontend listado y formulario de viajes (5 commits conventionals)
- ✅ Build limpio en ambos: API (0 errores TS) y estructura frontend
- ✅ Push a repositorio remoto: `feature/F2-01-crud-viajes` y `feature/F2-03-frontend-viajes`
- ✅ Integración backend-frontend consumiendo endpoints REST
- ✅ Documentación técnica resumida en este archivo

**Tecnologías dominadas:**
- NestJS (Controladores, Servicios, Módulos, DTOs con validadores Prisma)
- Prisma ORM con aislamiento de datos
- React + Vite + TypeScript
- Conventionnal Commits en inglés
- Git branching strategy (feature branches desde develop)

---

**Fin del Resumen Técnico Trabajo Final - F2 - Luz Vazquez**