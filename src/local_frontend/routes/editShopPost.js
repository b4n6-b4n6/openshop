export default async (ctx) => {
  const { request } = ctx;
  const { name, description } = request.body;

  const { onionSpinner, backend } = ctx;
  const address = onionSpinner.onion;
  const { shops } = backend;

  await shops.update({ address, name, description });

  ctx.redirectWith303('/shop');
};
