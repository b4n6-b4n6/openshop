import {
  MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
} from '../../const.js';
import productsPage from '../pages/productsPage.js';

export default async (ctx) => {
  const { backend, thumbnailCache } = ctx;
  const { products } = backend;

  const allProducts = (
    await Promise.all(
      (await products.getAll()).map(async (product) => ({
        ...product,
        photo: (
          product.photo_exists
            ? await thumbnailCache.genThumb(
              `product:${product.id}`,
              () => products.getPhoto(product.id),
              MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
            )
            : null
        ),
      })),
    )
  );

  ctx.body = productsPage({ allProducts });
};
