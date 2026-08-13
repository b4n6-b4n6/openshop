import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CACHE_CONTROL_FOREVER } from '../../const.js';

const { BYPASS_STATIC_FILES_CACHE } = process.env;

const PUBLIC_PATH = fileURLToPath(new URL('../public/', import.meta.url));
const STATIC_ALIASES = new Map([
  [
    'jsqr.js',
    fileURLToPath(new URL('../../../node_modules/jsqr/dist/jsQR.js', import.meta.url)),
  ],
]);
const TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
const cache = new Map();

export default () => async (ctx, next) => {
  if (!ctx.path.startsWith('/static/')) {
    await next();
    return;
  }

  const requested = decodeURIComponent(ctx.path.slice('/static/'.length));
  const aliased = STATIC_ALIASES.get(requested);
  const resolved = aliased ?? path.resolve(PUBLIC_PATH, requested);
  if (!aliased && !resolved.startsWith(PUBLIC_PATH)) {
    ctx.throw(404);
  }

  try {
    let file;

    if (!BYPASS_STATIC_FILES_CACHE) {
      file = cache.get(resolved);
      if (!file) {
        file = await fs.readFile(resolved);
        cache.set(resolved, file);
      }
    } else {
      file = await fs.readFile(resolved);
    }

    const { v } = ctx.query;
    if (v) {
      ctx.set('ETag', `"${v}"`);
      if (ctx.get('if-none-match') === `"${v}"`) {
        ctx.status = 304;
        return;
      }
      ctx.set('Cache-Control', CACHE_CONTROL_FOREVER);
    }

    ctx.type = TYPES[path.extname(resolved)] ?? 'application/octet-stream';
    ctx.body = file;
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      ctx.throw(404);
    }
    throw error;
  }
};
