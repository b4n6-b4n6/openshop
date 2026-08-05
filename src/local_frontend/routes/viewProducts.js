import {
  MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
} from '../../const.js';
import bufferToImageDataURI from '../../utils/bufferToImageDataURI.js';
import viewProductsPage from '../pages/viewProductsPage.js';

export default async (ctx) => {
  const { backend, thumbnailCache } = ctx;
  const { products } = backend;

  const allProducts = (
    await Promise.all( // ???? quering photo from database is excessive here / TODO
      (await products.getAll()).map(async (product) => {
        const photo = product.photo
          ? await thumbnailCache.genThumb(
            `product:${product.id}`,
            product.photo,
            MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
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
