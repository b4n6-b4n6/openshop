import session from 'koa-session';

const store = new Map();
const memoryStore = {
  async get(key) {
    const entry = store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      store.delete(key);
      return null;
    }
    return entry.data;
  },

  async set(key, sess, maxAge) {
    const expires = Date.now() + maxAge;
    store.set(key, { data: sess, expires });
  },

  async destroy(key, { ctx }) {
    store.delete(key);
  },
};

const CONFIG = {
  key: 'session',
  signed: false,
  store: memoryStore,
};

export default (app) => session(CONFIG, app);
