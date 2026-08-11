import { jest } from '@jest/globals';
import staticFiles from './staticFiles.js';

test('serves the self-hosted QR decoder', async () => {
  const ctx = {
    path: '/static/jsqr.js',
    set: jest.fn(),
    get: jest.fn(),
  };
  const next = jest.fn();

  await staticFiles()(ctx, next);

  expect(next).not.toHaveBeenCalled();
  expect(ctx.type).toBe('text/javascript; charset=utf-8');
  expect(ctx.body.toString()).toContain('webpackUniversalModuleDefinition');
});
