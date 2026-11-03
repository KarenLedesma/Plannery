# web (frontend React)

Todavía no está creada la app: la crea F1 (React con Vite) como primera tarea del frontend.

## Organización
```
src/
├─ features/        una carpeta por funcionalidad, con su dueña
│  ├─ auth/         F1
│  ├─ viajes/       F2
│  ├─ itinerario/   F2
│  ├─ catalogo/     F3 (admin)
│  ├─ recomendaciones/ F3
│  ├─ gastos/       F4
│  └─ resumen/      F5
└─ shared/          cliente HTTP, layout, componentes comunes (lo mantiene F1)
```
Cada funcionalidad contiene sus páginas, componentes y llamadas a la API. Para no pisarse, una funcionalidad no edita archivos de otra: si necesita algo de otra, lo pide o lo importa.

El frontend nunca decide permisos: oculta o muestra pantallas, pero la seguridad la hace el backend.
