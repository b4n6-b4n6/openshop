import genQr from '../../utils/genQr.js';
import createInvoiceUri from '../../utils/createInvoiceUri.js';
import picoToXmr from '../../utils/picoToXmr.js';
import { orderVersion } from '../../shared/utils/viewVersions.js';
import orderThreadPage from '../pages/orderThreadPage.js';
import enhanceOrder from '../../backend/utils/enhanceOrder.js';

export default async (ctx) => {
  const {
    params, backend, state, thumbCache,
  } = ctx;
  const { orders } = backend;
  const { id } = params;

  const order = await orders.get(id);
  if (!order || order.customer !== state.user.userId) {
    ctx.throw(404, 'Order not found');
  }

  const depositAddress = ctx.walletHandler.address;
  if (!depositAddress) {
    ctx.throw(500, 'Payment address unavailable');
  }

  const version = orderVersion(order);
  if (ctx.tryCacheEntity(version)) { return; }

  const amount = picoToXmr(order.deposit_amount);
  const qr = await genQr(createInvoiceUri({ depositAddress, amount }));

  ctx.body = orderThreadPage({
    order: {
      ...await enhanceOrder({ order, orders, thumbCache }),
      id,
    },
    depositAddress,
    qr,
    version,
  });
};
