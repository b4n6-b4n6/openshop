import {
  MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
} from '../../const.js';
import viewOrdersPage from '../pages/viewOrdersPage.js';

export default async (ctx) => {
  const { backend, thumbnailCache } = ctx;
  const { orders } = backend;

  const allOrders = (
    await Promise.all( // ???? quering photo from database is excessive here / TODO
      (await orders.getAllForShop()).map(async (order) => ({
        ...order,
        product_photo: (
          order.product_photo
            ? await thumbnailCache.genThumb(
              `product:${order.id}`,
              order.product_photo,
              MY_SHOP_PRODUCT_PHOTO_MAX_DIMENSION,
            )
            : null
        ),
      })),
    )
  );

  ctx.body = viewOrdersPage({ allOrders });
};
