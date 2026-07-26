import createMessages from './Messages/index.js';
import createOrders from './Orders/index.js';
import createProducts from './Products/index.js';
import createShops from './Shops/index.js';
import createPool from './createPool.js';

export default async () => {
  const pool = createPool();
  const shops = await createShops(pool);
  const products = await createProducts(pool);
  const messages = await createMessages(pool);
  const orders = await createOrders(pool);

  return async (ctx, next) => {
    ctx.backend = {
      shops,
      products,
      messages,
      orders,
    };

    await next();
  };
};
