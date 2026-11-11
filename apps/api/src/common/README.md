# common

Código compartido por todos los módulos. **Lo mantiene F1.** Si necesitás algo acá, pedilo o hacé un pull request chico.

## Cómo proteger una ruta
El módulo de la funcionalidad importa `AuthModule` para poder usar los guards:

```ts
@Module({ imports: [AuthModule], controllers: [...], providers: [...] })
export class ViajesModule {}
```

**Solo usuarios logueados** (responde 401 si no hay sesión válida):
```ts
@Controller('viajes')
@UseGuards(JwtAuthGuard)
export class ViajesController {
  @Get()
  listar(@CurrentUser() usuario: UsuarioActual) {
    return this.viajes.listar(usuario.id); // siempre filtrar por el dueño
  }
}
```

**Solo ciertos roles** (responde 403 si el rol no corresponde). `JwtAuthGuard` va primero:
```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Post()
crear(@Body() dto: CrearActividadDto) { ... }
```

## Contenido
- `guards/jwt-auth.guard.ts`: verifica la cookie con el token. Sin token válido, 401.
- `guards/roles.guard.ts`: compara el rol con `@Roles(...)`. Rol incorrecto, 403.
- `decorators/roles.decorator.ts`: `@Roles('ADMIN')`.
- `decorators/current-user.decorator.ts`: `@CurrentUser()` devuelve `{ id, rol }`.
- `filters/all-exceptions.filter.ts`: los errores inesperados devuelven un mensaje genérico; el detalle queda solo en el log del servidor (R7).

## Regla de oro
Que un recurso sea del usuario se verifica en el servicio, filtrando por `usuarioId`. Si es de otra persona se responde 404, igual que si no existiera.
