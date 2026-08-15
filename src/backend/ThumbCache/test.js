import { randomUUID } from 'node:crypto';
import ThumbCache from './index.js';

test('empty cache', async () => {
  const thumbCache = new ThumbCache();

  expect(await thumbCache.get(randomUUID())).toBeFalsy();

  thumbCache.destroy();
});

test('non-empty cache', async () => {
  const thumbCache = new ThumbCache();

  const key = randomUUID();
  const value = Buffer.from('1234abcd', 'hex');

  await thumbCache.set(key, value);
  expect(await thumbCache.get(key)).toEqual(value);

  thumbCache.destroy();
});

test('emptied cache', async () => {
  const thumbCache = new ThumbCache();

  const key = randomUUID();
  const value = Buffer.from('1234abcd', 'hex');

  await thumbCache.set(key, value);
  await thumbCache.clear(key);
  expect(await thumbCache.get(key)).toBeFalsy();

  thumbCache.destroy();
});
