import {
  MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
} from '../../const.js';
import viewProductsPage from '../pages/viewProductsPage.js';

export default async (ctx) => {
  const { backend, thumbnailCache } = ctx;
  const { products } = backend;

  const allProducts = (
    await Promise.all(
      (await products.getAll()).map(async (product) => ({
        ...product,
        photo: (
          product.photo
            ? await thumbnailCache.genThumb(
              `product:${product.id}`,
              product.photo,
              MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
            )
            : null
        ),
      })),
    )
  );

  ctx.body = viewProductsPage({ allProducts });
};
