import { Test, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { REFRESH_TOKEN_COOKIE } from '../../common/constants';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    const module = Test.createTestingModule({
      guards: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('debe permitir el acceso si el token es válido', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { token: 'valid-jwt-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('debe rechazar el acceso si no hay token', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {},
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('debe rechazar el acceso si el token es inválido', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: { token: 'invalid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });
});