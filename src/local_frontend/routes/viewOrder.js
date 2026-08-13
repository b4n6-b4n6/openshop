import createInvoiceUri from '../../utils/createInvoiceUri.js';
import picoToXmr from '../../utils/picoToXmr.js';
import genQr from '../../utils/genQr.js';
import viewOrderPage from '../pages/viewOrderPage.js';

export default async (ctx) => {
  const { params, backend } = ctx;
  const { orders } = backend;
  const { id } = params;

  const order = await orders.get(id);
  if (!order) ctx.throw(404, 'Order not found');

  const depositAddress = ctx.walletSetup.address;
  if (!depositAddress) { ctx.throw(503, 'Payment address unavailable'); }

  const amount = picoToXmr(order.deposit_amount);
  const qr = await genQr(createInvoiceUri({ depositAddress, amount }));

  ctx.body = viewOrderPage({
    id,
    customer: order.customer,
    qrCaption: depositAddress,
    qr,
  });
};
