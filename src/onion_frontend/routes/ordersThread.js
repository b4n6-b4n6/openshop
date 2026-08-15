import enhanceOrders from '../../backend/utils/enhanceOrders.js';
import {
  CACHE_CONTROL_LIVE,
  ORDERS_PAGE_REFRESH,
} from '../../const.js';
import { ordersThreadPage } from '../../shared/pages/ordersPage.js';
import { ordersVersion } from '../../shared/utils/viewVersions.js';

export default async (ctx) => {
  const { backend, state, thumbCache } = ctx;
  const { orders } = backend;
  const { userId } = state.user;

  const allOrders = await orders.getAllForCustomer(userId);
  const version = ordersVersion(allOrders);

  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }
  ctx.set('Cache-Control', CACHE_CONTROL_LIVE);

  ctx.body = ordersThreadPage({
    allOrders: await enhanceOrders({ allOrders, orders, thumbCache }),
    refresh: ORDERS_PAGE_REFRESH,
  });
};
