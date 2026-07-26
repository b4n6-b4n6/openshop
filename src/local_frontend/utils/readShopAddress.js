import fs from 'node:fs/promises';
import { MY_SHOP_ONION_PATH } from '../../const.js';

export default async (ctx) => {
  if (ctx.onionSpinner?.onion) { return ctx.onionSpinner.onion; }

  try {
    return (await fs.readFile(MY_SHOP_ONION_PATH, 'utf8')).trim();
  } catch (error) {
    if (error.code === 'ENOENT') { return null; }
    throw error;
  }
};
