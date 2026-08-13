import viewOrderPage from '../pages/viewOrderPage.js';

export default async (ctx) => {
  const { params, backend } = ctx;
  const { orders } = backend;
  const { id } = params;

  const order = await orders.get(id);
  if (!order) ctx.throw(404, 'Order not found');

  ctx.body = viewOrderPage({ id, customer: order.customer });
};
