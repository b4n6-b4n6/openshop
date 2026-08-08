import {
  MY_SHOP_PRODUCT_THUMB_SIZE,
} from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import productsPage from '../pages/productsPage.js';

export default async (ctx) => {
  const { backend, thumbnailCache } = ctx;
  const { products } = backend;

  const allProducts = (
    await Promise.all(
      (await products.getAll()).map(async (product) => {
        const photo = product.photo_exists
          ? await thumbnailCache.genThumb(
            `product:${product.id}`,
            () => products.getPhoto(product.id),
            MY_SHOP_PRODUCT_THUMB_SIZE,
          )
          : null;

        return {
          ...product,
          photo: await bufferToImageDataURI(photo),
        };
      }),
    )
  );

  ctx.body = productsPage({ allProducts });
};
