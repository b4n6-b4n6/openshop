import fs from 'node:fs/promises';
import { ONION_PATH } from '../../const.js';
import createSingleCached from './createSingleCached.js';

export default createSingleCached(async () => (
  (await fs.readFile(`${ONION_PATH}/hostname`, 'utf8')).trim()
));
