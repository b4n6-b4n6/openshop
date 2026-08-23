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
  if (!(Number(purchase_quantity) > 0)) {
    ctx.throw(400, 'No quantity specified');
  }

  const product = await products.get(id);
  if (!product) {
    ctx.throw(404, 'Product not found');
  }

  const { available_quantity } = product;
  if (!(available_quantity - purchase_quantity >= 0)) {
    ctx.throw(400, 'Specified quantity is not available');
  }

  const fiatRates = await fetchFiatRates();
  const fiatRate = fiatRates[product.currency];
  if (!fiatRate) {
    ctx.throw(500, 'Faield to acquire current market rate');
  }

  const purchase_price = Number(product.price) * Number(purchase_quantity);
  if (!purchase_price) {
    ctx.throw(500, 'Faield to calculate order price in fiat');
  }

  const deposit_amount = floatingXmrToPico(purchase_price / fiatRate);
  if (!deposit_amount) {
    ctx.throw(500, 'Faield to calculate order deposit amount in xmr');
  }
  const deposit_amount_noisy = deposit_amount + genPicoNoise();

  const orderId = await orders.create({
    customer: userId,
    product_name: product.name,
    product_photo: product.photo,
    purchase_currency: product.currency,
    deposit_amount: deposit_amount_noisy,
    purchase_price,
    purchase_quantity,
  });

  ctx.redirectWith303(`/browser/orders/${orderId}`);
};
