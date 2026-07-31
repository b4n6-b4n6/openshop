import Redis from 'ioredis';
import convert from './convert.js';

const TTL = 60 * 60 * 24 * 7;
const KEY = (key) => `thumbnail_cache:${key}`;

class ThumbnailCache {
  constructor() {
    this.redis = new Redis();
  }

  async get(key) {
    return this.redis.getBuffer(KEY(key));
  }

  async set(key, value) {
    const result = await this.redis.setex(KEY(key), TTL, value);
    if (result !== 'OK') { throw new Error(`Redis.setex returned ${result}`); }
  }

  async clear(key) {
    await this.redis.del(KEY(key));
  }

  async getThumbnail(key, value) {
    const cached = await this.get(key);
    if (cached) { return cached; }

    const thumbnail = await convert(value);
    await this.set(key, thumbnail);

    return thumbnail;
  }
}

export default ThumbnailCache;
