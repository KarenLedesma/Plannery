import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CatalogoController } from './catalogo.controller';

// Arma un contexto como el que arma Nest: qué método se llama y quién es el usuario
function contexto(metodo: keyof CatalogoController, user: { id: string; rol: string }) {
  return {
    getHandler: () => CatalogoController.prototype[metodo],
    getClass: () => CatalogoController,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

const viajero = { id: 'u1', rol: 'VIAJERO' };
const admin = { id: 'u2', rol: 'ADMIN' };
const protegidos: (keyof CatalogoController)[] = ['crear', 'actualizar', 'eliminar'];

describe('CatalogoController: permisos', () => {
  describe('roles declarados', () => {
    it.each(protegidos)('%s exige el rol ADMIN', (metodo) => {
      expect(Reflect.getMetadata('roles', CatalogoController.prototype[metodo])).toEqual(['ADMIN']);
    });

    it('listar no exige ningún rol en particular', () => {
      expect(Reflect.getMetadata('roles', CatalogoController.prototype.listar)).toBeUndefined();
    });
  });

  describe('RolesGuard aplicado al catálogo', () => {
    const guard = new RolesGuard(new Reflector());

    it.each(protegidos)('%s rechaza a un VIAJERO con 403', (metodo) => {
      expect(() => guard.canActivate(contexto(metodo, viajero))).toThrow(ForbiddenException);
    });

    it.each(protegidos)('%s deja pasar a un ADMIN', (metodo) => {
      expect(guard.canActivate(contexto(metodo, admin))).toBe(true);
    });

    it('listar deja pasar a cualquier usuario con sesión', () => {
      expect(guard.canActivate(contexto('listar', viajero))).toBe(true);
    });
  });
});