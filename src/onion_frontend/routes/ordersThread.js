import enhanceOrders from '../../backend/utils/enhanceOrders.js';
import ordersThreadPage from '../pages/ordersThreadPage.js';
import { ordersVersion } from '../../shared/utils/viewVersions.js';

export default async (ctx) => {
  const { backend, state, thumbCache } = ctx;
  const { orders } = backend;
  const { userId } = state.user;

  const allOrders = await orders.getAllForCustomer(userId);
  const version = ordersVersion(allOrders);
  if (ctx.tryCacheEntity(version)) { return; }

  ctx.body = ordersThreadPage({
    allOrders: await enhanceOrders({ allOrders, orders, thumbCache }),
  });
};
