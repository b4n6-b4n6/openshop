import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const KEY_COOKIE_NAME = 'sak';
const KEY_FILE_NAME = '.sak';
const { BYPASS_SAK } = process.env;

const generateRandomKey = () => (
  crypto.randomBytes(32).toString('hex')
);

const prepareSingularAccessKey = async () => {
  try {
    await fs.access(KEY_FILE_NAME);
  } catch (err) {
    if (err.code === 'ENOENT') {
      const rightKey = generateRandomKey();
      await fs.writeFile(KEY_FILE_NAME, rightKey);
      return [rightKey, true];
    }

    throw err;
  }

  const rightKey = (await fs.readFile(KEY_FILE_NAME)).toString();
  return [rightKey, false];
};

export default () => async (ctx, next) => {
  if (BYPASS_SAK) {
    await next();
    return;
  }

  const [rightKey, isFresh] = await prepareSingularAccessKey();

  if (isFresh) {
    ctx.cookies.set(
      KEY_COOKIE_NAME,
      rightKey,
      { expires: new Date('9999-12-31T23:59:59.999Z') },
    );
  }

  const key = ctx.cookies.get(KEY_COOKIE_NAME);
  if (key !== rightKey) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    return;
  }

  await next();
};
