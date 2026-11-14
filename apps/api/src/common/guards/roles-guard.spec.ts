import { Test, describe, it, expect } from '@jest/globals';
import { RolesGuard } from './roles-guard.guard';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    const module = Test.createTestingModule({
      guards: [RolesGuard],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });

  it('debe permitir el acceso si el rol coincide', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { rol: 'ADMIN' },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('debe rechazar el acceso si el rol no coincide', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { rol: 'VIAJERO' },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });
});