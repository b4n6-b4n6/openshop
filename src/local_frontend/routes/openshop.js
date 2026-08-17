import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const LANDING_PATH = fileURLToPath(new URL('../pages/landing.html', import.meta.url));

export default async (ctx) => {
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = await fs.readFile(LANDING_PATH, 'utf-8');
};
