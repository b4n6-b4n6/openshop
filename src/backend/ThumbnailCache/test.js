import { randomUUID } from 'node:crypto';
import ThumbnailCache from './index.js';

test('empty cache', async () => {
  const thumbnailCache = new ThumbnailCache();

  expect(await thumbnailCache.get(randomUUID())).toBeFalsy();

  thumbnailCache.destroy();
});

test('non-empty cache', async () => {
  const thumbnailCache = new ThumbnailCache();

  const key = randomUUID();
  const value = Buffer.from('1234abcd', 'hex');

  await thumbnailCache.set(key, value);
  expect(await thumbnailCache.get(key)).toEqual(value);

  thumbnailCache.destroy();
});

test('emptied cache', async () => {
  const thumbnailCache = new ThumbnailCache();

  const key = randomUUID();
  const value = Buffer.from('1234abcd', 'hex');

  await thumbnailCache.set(key, value);
  await thumbnailCache.clear(key);
  expect(await thumbnailCache.get(key)).toBeFalsy();

  thumbnailCache.destroy();
});
