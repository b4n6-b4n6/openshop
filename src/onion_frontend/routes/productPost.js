import fetchFiatRates from '../utils/fetchFiatRates.js';
import floatingXmrToPico from '../utils/floatingXmrToPico.js';
import genPicoNoise from '../utils/genPicoNoise.js';

export default async (ctx) => {
  const {
    request, backend, params, state,
  } = ctx;
  const { products, orders } = backend;
  const { id } = params;
  const { userId } = state.user;

  const { purchase_quantity } = request.body;
  if (!(Number(purchase_quantity) > 0)) { throw new Error('no purchase_quantity'); }

  const product = await products.get(id);
  if (!product) { throw new Error('no product'); }

  const { available_quantity } = product;
  if (!(available_quantity - purchase_quantity >= 0)) { throw new Error('no available quantity'); }

  const fiatRates = await fetchFiatRates();
  const fiatRate = fiatRates[product.currency];
  if (!fiatRate) { throw new Error('no fiat rate'); }

  const purchase_price = Number(product.price) * Number(purchase_quantity);
  if (!purchase_price) { throw new Error('no purchase price'); }

  const deposit_amount = floatingXmrToPico(purchase_price / fiatRate);
  if (!deposit_amount) { throw new Error('no deposit amount'); }
  const deposit_amount_noisy = deposit_amount + genPicoNoise();

  const orderId = await orders.create({
    customer: userId,
    product_name: product.name,
    product_photo: product.photo,
    product_description: product.description,
    purchase_currency: product.currency,
    deposit_amount: deposit_amount_noisy,
    purchase_price,
    purchase_quantity,
  });

  ctx.status = 303;
  ctx.redirect(`/browser/orders/${orderId}`);
};
