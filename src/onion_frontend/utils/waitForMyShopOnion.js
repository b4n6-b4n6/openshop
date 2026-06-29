/* eslint-disable no-await-in-loop */

import fs from 'node:fs/promises';
import timers from 'node:timers/promises';
import { ONION_PATH } from '../../const.js';

const checkAccess = async (path) => {
  try {
    await fs.access(path);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }

    throw err;
  }

  return true;
};

export default async () => {
  for (;;) {
    if (await checkAccess(`${ONION_PATH}/hostname`)) {
      break;
    }
    await timers.setTimeout(2500);
  }
};
