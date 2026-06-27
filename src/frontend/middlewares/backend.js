// import createShops from '../../backend/Shops.js';
// import createProducts from '../../backend/Products.js';
// import createOrders from '../../backend/Orders.js';
import createPool from '../../backend/createPool.js';

export default async () => {
  const pool = createPool();
  // const shops = await createShops(pool);
  // const products = await createProducts(pool);
  // const orders = await createOrders(pool);

  return async (ctx, next) => {
    ctx.backend = {
      // shops,
      // products,
      // orders,
    };

    await next();
  };
};
