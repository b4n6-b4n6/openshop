import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const KEY_FILE_NAME = '.jwt';

export default async () => {
  try {
    await fs.access(KEY_FILE_NAME);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(KEY_FILE_NAME, crypto.randomBytes(32));
    } else {
      throw err;
    }
  }

  return (await fs.readFile(KEY_FILE_NAME)).toString('hex');
};
