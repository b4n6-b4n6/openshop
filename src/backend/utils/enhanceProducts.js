import { THUMB_CACHE_KEY, THUMB_CACHE_SIZE } from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';

export default async ({ allProducts, thumbCache, products }) => (
  Promise.all(
    allProducts.map(async (product) => ({
      ...product,
      photo: bufferToImageDataURI(
        product.photo_exists
          ? await thumbCache.genThumb(
            `${THUMB_CACHE_KEY.PRODUCT}:${product.id}`,
            () => products.getPhoto(product.id),
            THUMB_CACHE_SIZE.PRODUCT,
          )
          : null,
      ),
    })),
  )
);
