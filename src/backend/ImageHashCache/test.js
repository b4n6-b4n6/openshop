import { randomUUID } from 'node:crypto';
import ImageHashCache from './index.js';

test('empty cache', async () => {
  const imageHashCache = new ImageHashCache();

  expect(await imageHashCache.get(randomUUID())).toBeFalsy();

  imageHashCache.destroy();
});

test('non-empty cache', async () => {
  const imageHashCache = new ImageHashCache();

  const key = randomUUID();
  const value = Buffer.from('1234abcd', 'hex').toString();

  await imageHashCache.set(key, value);
  expect(await imageHashCache.get(key)).toEqual(value);

  imageHashCache.destroy();
});

test('emptied cache', async () => {
  const imageHashCache = new ImageHashCache();

  const key = randomUUID();
  const value = Buffer.from('1234abcd', 'hex').toString();

  await imageHashCache.set(key, value);
  await imageHashCache.clear(key);
  expect(await imageHashCache.get(key)).toBeFalsy();

  imageHashCache.destroy();
});
