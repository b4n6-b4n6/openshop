import createInvoiceUri from '../../utils/createInvoiceUri.js';
import picoToXmr from '../../utils/picoToXmr.js';
import genQr from '../../utils/genQr.js';
import orderPage from '../pages/orderPage.js';

export default async (ctx) => {
  const { params, backend, state } = ctx;
  const { orders } = backend;
  const { id } = params;

  const order = await orders.get(id);
  if (!order || order.customer !== state.user.userId) {
    ctx.throw(404, 'Order not found');
  }

  const depositAddress = ctx.walletHandler.address;
  if (!depositAddress) { ctx.throw(503, 'Payment address unavailable'); }

  const amount = picoToXmr(order.deposit_amount);
  const qr = await genQr(createInvoiceUri({ depositAddress, amount }));

  ctx.body = orderPage({
    id,
    customer: order.customer,
    qrCaption: depositAddress,
    qr,
  });
};
