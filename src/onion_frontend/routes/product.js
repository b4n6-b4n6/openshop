import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import productPage from '../pages/productPage.js';

export default async (ctx) => {
  const { params, backend } = ctx;
  const { products } = backend;
  const { id } = params;

  const product = await products.get(id);
  if (!product) { ctx.throw(404, 'Product not found'); }

  const {
    name,
    photo,
    description,
    price,
    currency,
    available_quantity,
  } = product;

  ctx.body = productPage({
    id,
    name,
    photo: bufferToImageDataURI(photo),
    description,
    price,
    currency,
    available_quantity,
  });
};
