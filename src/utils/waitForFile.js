/* eslint-disable no-await-in-loop */

import timers from 'node:timers/promises';
import checkAccess from './checkAccess.js';

export default async (path) => {
  for (;;) {
    if (await checkAccess(path)) { break; }
    await timers.setTimeout(2500);
  }
};
