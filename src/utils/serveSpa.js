import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

const MIME_TYPES = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const findFile = async (root, requestPath) => {
  const relativePath = decodeURIComponent(requestPath).replace(/^\/+/, '');
  const candidate = path.resolve(root, relativePath);

  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    return null;
  }

  try {
    const stat = await fsPromises.stat(candidate);
    return stat.isFile() ? candidate : null;
  } catch (error) {
    if (error.code === 'ENOENT') { return null; }
    throw error;
  }
};

export default (rootPath) => {
  const root = path.resolve(rootPath);
  const indexPath = path.join(root, 'index.html');

  return async (ctx, next) => {
    if (!['GET', 'HEAD'].includes(ctx.method) || ctx.path.startsWith('/api/')) {
      await next();
      return;
    }

    const requestedFile = await findFile(root, ctx.path);
    const filePath = requestedFile ?? indexPath;

    try {
      await fsPromises.access(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await next();
        return;
      }
      throw error;
    }

    ctx.type = MIME_TYPES[path.extname(filePath)] ?? 'application/octet-stream';
    ctx.body = fs.createReadStream(filePath);
  };
};
