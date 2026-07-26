import fs from 'node:fs/promises';
import { BROWSED_ONION_COOKIE_NAME } from '../../const.js';

const BROWSED_ONION_FILE_NAME = '.bo';

export default () => {
  let lastBrowsedOnion;
  return async (ctx, next) => {
    const browsedOnion = ctx.cookies.get(BROWSED_ONION_COOKIE_NAME);

    if (lastBrowsedOnion !== browsedOnion) {
      await fs.writeFile(BROWSED_ONION_FILE_NAME, browsedOnion ?? '');
      lastBrowsedOnion = browsedOnion;
    }

    await next();
  };
};
