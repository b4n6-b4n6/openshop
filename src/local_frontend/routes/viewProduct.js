import { MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION } from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import viewProductPage from '../pages/viewProductPage.js';

export default async (ctx) => {
  const { params, backend, thumbnailCache } = ctx;
  const { products } = backend;
  const { id } = params;

  const product = await products.get(id);
  if (!product) { throw new Error('no product'); }

  const {
    name,
    photo,
    description,
    price,
    currency,
    available_quantity,
  } = product;

  const thumbnail = photo
    ? await thumbnailCache.genThumb(
      `product:${id}`,
      photo,
      MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
    )
    : null;

  ctx.body = viewProductPage({
    id,
    name,
    photo: await bufferToImageDataURI(thumbnail),
    description,
    price,
    currency,
    available_quantity,
  });
};
