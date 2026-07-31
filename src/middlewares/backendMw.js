import createShops from '../backend/Shops/index.js';
import createMessages from '../backend/Messages/index.js';
import createProducts from '../backend/Products/index.js';
import createPool from '../backend/createPool.js';

export default async () => {
  const pool = createPool();
  const shops = await createShops(pool);
  const products = await createProducts(pool);
  const messages = await createMessages(pool);

  return async (ctx, next) => {
    ctx.backend = {
      shops,
      products,
      messages,
    };

    await next();
  };
};
