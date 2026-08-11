import { createHash } from 'node:crypto';
import Redis from 'ioredis';
import isTest from '../../utils/isTest.js';

const hash = (value) => createHash('sha256')
  .update(JSON.stringify(value))
  .digest('base64url');

const TTL = isTest ? 15 : 60 * 60 * 24 * 7;
const KEY = (key) => `image_hash_cache:${key}`;

class ImageHashCache {
  constructor() {
    this.redis = new Redis();
  }

  async get(key) {
    return this.redis.get(KEY(key));
  }

  async set(key, value) {
    const result = await this.redis.setex(KEY(key), TTL, value);
    if (result !== 'OK') { throw new Error(`Redis.setex returned ${result}`); }
  }

  async clear(key) {
    await this.redis.del(KEY(key));
  }

  async genDigest(key, getValue) {
    const value = await (getValue instanceof Function ? getValue() : getValue);
    const digest = await hash(value);
    await this.set(key, digest);
    return digest;
  }

  destroy() {
    this.redis.disconnect();
  }
}

export default ImageHashCache;
