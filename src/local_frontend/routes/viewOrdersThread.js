import { ordersVersion } from '../../shared/utils/viewVersions.js';
import viewOrdersThreadPage from '../pages/viewOrdersThreadPage.js';
import enhanceOrders from '../../backend/utils/enhanceOrders.js';

export default async (ctx) => {
  const { backend, thumbCache } = ctx;
  const { orders } = backend;

  const allOrders = await orders.getAllForShop();
  const version = ordersVersion(allOrders);
  if (ctx.tryCacheEntity(version)) { return; }

  ctx.body = viewOrdersThreadPage({
    allOrders: await enhanceOrders({ allOrders, orders, thumbCache }),
  });
};
