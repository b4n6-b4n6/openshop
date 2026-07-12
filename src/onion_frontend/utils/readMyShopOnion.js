import fs from 'node:fs/promises';
import { MY_SHOP_ONION_PATH } from '../../const.js';
import createSingleCached from './createSingleCached.js';

export default createSingleCached(async () => (
  (await fs.readFile(`${MY_SHOP_ONION_PATH}/hostname`, 'utf8')).trim()
));
