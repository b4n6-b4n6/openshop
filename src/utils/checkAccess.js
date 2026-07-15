import fs from 'node:fs/promises';

export default async (path) => {
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
