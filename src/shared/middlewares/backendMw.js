import createShops from '../../backend/Shops/index.js';
import createProducts from '../../backend/Products/index.js';
import createOrders from '../../backend/Orders/index.js';
import createMessages from '../../backend/Messages/index.js';
import createPool from '../../backend/createPool.js';
import { ORDER_EXPIRY_PERIOD } from '../../const.js';

const { EXPIRE_ALL_ORDERS_ASAP } = process.env;
const ORDER_EXPIRY_POLL_INTERVAL = 1000 * 30;

export default async (withExpiryPolling) => {
  const pool = createPool();
  const shops = await createShops(pool);
  const products = await createProducts(pool);
  const orders = await createOrders(pool);
  const messages = await createMessages(pool);

  if (withExpiryPolling) {
    setInterval(
      () => {
        orders.expireOld(EXPIRE_ALL_ORDERS_ASAP ? 1 : ORDER_EXPIRY_PERIOD);
      },
      ORDER_EXPIRY_POLL_INTERVAL,
    );
  }

  return async (ctx, next) => {
    ctx.backend = {
      pool,
      shops,
      products,
      orders,
      messages,
    };

    await next();
  };
};
