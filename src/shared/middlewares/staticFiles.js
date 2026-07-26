import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC_PATH = fileURLToPath(new URL('../public/', import.meta.url));
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
  const resolved = path.resolve(PUBLIC_PATH, requested);
  if (!resolved.startsWith(PUBLIC_PATH)) {
    ctx.throw(404);
  }

  try {
    let body = cache.get(resolved);
    if (!body) {
      body = await fs.readFile(resolved);
      cache.set(resolved, body);
    }
    ctx.type = TYPES[path.extname(resolved)] ?? 'application/octet-stream';
    ctx.set('Cache-Control', 'public, max-age=604800, immutable');
    ctx.body = body;
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      ctx.throw(404);
    }
    throw error;
  }
};
