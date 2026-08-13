import { THUMB_CACHE_SIZE, THUMB_CACHE_KEY } from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import viewProductsPage from '../pages/viewProductsPage.js';

export default async (ctx) => {
  const { backend, thumbnailCache } = ctx;
  const { products } = backend;

  const allProducts = (
    await Promise.all(
      (await products.getAll()).map(async (product) => {
        const photo = product.photo_exists
          ? await thumbnailCache.genThumb(
            `${THUMB_CACHE_KEY.PRODUCT}:${product.id}`,
            () => products.getPhoto(product.id),
            THUMB_CACHE_SIZE.PRODUCT,
          )
          : null;

        return {
          ...product,
          photo: await bufferToImageDataURI(photo),
        };
      }),
    )
  );

  ctx.body = viewProductsPage({ allProducts });
};
