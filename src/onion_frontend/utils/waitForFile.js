/* eslint-disable no-await-in-loop */

import fs from 'node:fs/promises';
import timers from 'node:timers/promises';

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

export default async (path) => {
  for (;;) {
    if (await checkAccess(path)) {
      break;
    }
    await timers.setTimeout(2500);
  }
};
