import {
  CACHE_CONTROL_LIVE,
} from '../../const.js';
import { ordersVersion } from '../../shared/utils/viewVersions.js';
import viewOrdersThreadPage from '../pages/viewOrdersThreadPage.js';
import enhanceOrders from '../../backend/utils/enhanceOrders.js';

export default async (ctx) => {
  const { backend, thumbCache } = ctx;
  const { orders } = backend;

  const allOrders = await orders.getAllForShop();
  const version = ordersVersion(allOrders);

  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }
  ctx.set('Cache-Control', CACHE_CONTROL_LIVE);

  ctx.body = viewOrdersThreadPage({
    allOrders: await enhanceOrders({ allOrders, orders, thumbCache }),
  });
};
