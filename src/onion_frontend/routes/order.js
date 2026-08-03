import orderPage from '../pages/orderPage.js';

export default async (ctx) => {
  const { params, backend } = ctx;
  const { orders } = backend;
  const { id } = params;

  const order = await orders.get(id);
  if (!order) { throw new Error('no order'); }

  const deposit_address = ctx.walletHandler.address;
  if (!deposit_address) { throw new Error('no deposit address'); }

  ctx.body = orderPage({
    ...order,
    deposit_address,
  });
};
