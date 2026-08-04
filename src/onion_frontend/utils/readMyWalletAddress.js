import fs from 'node:fs/promises';
import { MY_SHOP_WALLET_PATH } from '../../const.js';

export default async () => (
  (await fs.readFile(`${MY_SHOP_WALLET_PATH}.address.txt`, 'utf8')).trim()
);
