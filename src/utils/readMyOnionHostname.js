import fs from 'node:fs/promises';
import { MY_SHOP_ONION_PATH } from '../const.js';

export default async () => (
  (await fs.readFile(MY_SHOP_ONION_PATH, 'utf8')).trim()
);
