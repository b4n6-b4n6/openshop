import fs from 'node:fs/promises';

const BROWSED_ONION_FILE_NAME = '.bo';

export default () => {
  let lastBrowsedOnion;
  return async (ctx, next) => {
    const { onion } = ctx.session;

    if (lastBrowsedOnion !== onion) {
      await fs.writeFile(BROWSED_ONION_FILE_NAME, onion);
      lastBrowsedOnion = onion;
    }

    await next();
  };
};
