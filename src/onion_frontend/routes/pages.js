import Router from '@koa/router';
import QRCode from 'qrcode';
import { PublicError, toPublicError } from '../../utils/publicError.js';
import {
  cleanupUploads,
  uploadedFiles,
  uploadedImageToDataUrl,
} from '../../shared/utils/uploads.js';
import { escapeHtml, formValue } from '../../shared/utils/html.js';
import checkOpenShopBrowser from '../utils/checkOpenShopBrowser.js';
import fetchFiatPrice from '../utils/fetchFiatPrice.js';
import readMyShopAddress from '../utils/readMyShopAddress.js';
import {
  orderPage,
  ordersPage,
  publicProductsPage,
  publicShopPage,
  purchasePage,
} from '../pages/app.js';
import {
  chatPage,
  chatsPage,
  chatThreadPage,
} from '../../shared/pages/chatPages.js';

const router = new Router();

const basePath = (ctx) => (checkOpenShopBrowser(ctx) ? '/browser' : '');

const html = (ctx, body, status = 200) => {
  ctx.status = status;
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = body;
};

const redirect = (ctx, path) => {
  ctx.redirect(`${basePath(ctx)}${path}`);
  ctx.status = 303;
};

const requireCustomer = (ctx) => {
  const customer = ctx.state.user?.userId;
  if (!customer) {
    throw new PublicError('Customer identity is required.', {
      status: 401,
      code: 'customer_identity_required',
    });
  }
  return customer;
};

const orderBelongsTo = (order, customer) => (
  order && order.customer === customer
);

router
  .get('/', async (ctx) => {
    const onion = await readMyShopAddress();
    html(ctx, publicShopPage({
      onion,
      shop: await ctx.backend.shops.get(onion),
      basePath: basePath(ctx),
    }));
  })
  .get('/products', async (ctx) => {
    html(ctx, publicProductsPage({
      products: await ctx.backend.products.getAll(),
      basePath: basePath(ctx),
    }));
  })
  .get('/products/:id/purchase', async (ctx) => {
    const product = await ctx.backend.products.get(ctx.params.id);
    if (!product) { ctx.throw(404, 'Product not found'); }
    html(ctx, purchasePage({
      product,
      basePath: basePath(ctx),
    }));
  })
  .post('/products/:id/purchase', async (ctx) => {
    const customer = requireCustomer(ctx);
    const product = await ctx.backend.products.get(ctx.params.id);
    if (!product) { ctx.throw(404, 'Product not found'); }
    const quantity = Number(formValue(ctx.request.body?.quantity, 1));

    try {
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        throw new PublicError('Purchase quantity must be between 1 and 100.', {
          status: 400,
          code: 'invalid_purchase_quantity',
        });
      }
      if (quantity > product.available_quantity) {
        throw new PublicError('That quantity is no longer in stock.', {
          status: 409,
          code: 'insufficient_stock',
        });
      }
      if (await ctx.walletHandler.getSyncState() !== 'synced') {
        throw new PublicError(
          'The shop wallet is still syncing. Try the purchase again shortly.',
          { status: 503, code: 'wallet_syncing' },
        );
      }

      const prices = await fetchFiatPrice();
      const xmrPrice = Number(prices?.[String(product.currency).toLowerCase()]);
      if (!Number.isFinite(xmrPrice) || xmrPrice <= 0) {
        throw new PublicError(
          'The current Monero exchange rate is unavailable. Try again shortly.',
          { status: 503, code: 'rate_unavailable' },
        );
      }
      const depositAddress = await ctx.walletHandler.getUnusedDepositSubaddress();
      const depositAmount = BigInt(Math.ceil(
        ((Number(product.price) * quantity) / xmrPrice) * 1e12,
      ));
      const orderId = await ctx.backend.orders.create({
        customer,
        product_name: product.name,
        product_photo: product.photo,
        product_description: product.description,
        purchase_price: product.price,
        purchase_currency: product.currency,
        purchase_quantity: quantity,
        deposit_address: depositAddress,
        deposit_amount: depositAmount,
      });

      redirect(ctx, `/orders/${orderId}`);
    } catch (error) {
      const publicError = toPublicError(error);
      html(ctx, purchasePage({
        product,
        quantity,
        basePath: basePath(ctx),
        error: publicError.message,
      }), publicError.status);
    }
  })
  .get('/orders', async (ctx) => {
    const customer = requireCustomer(ctx);
    html(ctx, ordersPage({
      orders: await ctx.backend.orders.getAllForCustomer(customer),
      basePath: basePath(ctx),
    }));
  })
  .get('/orders/:id', async (ctx) => {
    const customer = requireCustomer(ctx);
    const order = await ctx.backend.orders.get(ctx.params.id);
    if (!orderBelongsTo(order, customer)) { ctx.throw(404, 'Order not found'); }
    const amount = Number(order.deposit_amount) / 1e12;
    const qr = await QRCode.toDataURL(
      `monero:${order.deposit_address}?tx_amount=${amount.toFixed(12)}`,
      {
        margin: 1,
        width: 240,
        errorCorrectionLevel: 'H',
        color: { dark: '#0f1115', light: '#ffffff' },
      },
    );
    html(ctx, orderPage({
      order,
      qr,
      basePath: basePath(ctx),
    }));
  })
  .get('/chats', async (ctx) => {
    const customer = requireCustomer(ctx);
    const onion = await readMyShopAddress();
    const chat = (await ctx.backend.messages.getConvos(customer))
      .find(({ id }) => id === onion);
    html(ctx, chatsPage({
      chats: [chat ?? {
        id: onion,
        last_message_at: new Date(),
        unread: false,
      }],
      basePath: basePath(ctx),
    }));
  })
  .get('/chats/:id', async (ctx) => {
    requireCustomer(ctx);
    const onion = await readMyShopAddress();
    if (ctx.params.id !== onion) { ctx.throw(404, 'Chat not found'); }
    html(ctx, chatPage({
      chatId: onion,
      basePath: basePath(ctx),
    }));
  })
  .get('/chats/:id/thread', async (ctx) => {
    const customer = requireCustomer(ctx);
    const onion = await readMyShopAddress();
    if (ctx.params.id !== onion) { ctx.throw(404, 'Chat not found'); }
    await ctx.backend.messages.markAllReadInConvo({
      sender: onion,
      receiver: customer,
    });
    const messages = await ctx.backend.messages.getConvo([onion, customer]);
    const version = messages.at(-1)?.id ?? 'empty';
    ctx.set('Cache-Control', 'no-store');
    ctx.set('ETag', `"${version}"`);
    if (ctx.get('if-none-match') === `"${version}"`) {
      ctx.status = 304;
      return;
    }
    html(ctx, chatThreadPage({
      messages,
      me: customer,
      chatId: onion,
      basePath: basePath(ctx),
    }));
  })
  .post('/chats/:id/messages', async (ctx) => {
    const customer = requireCustomer(ctx);
    const onion = await readMyShopAddress();
    if (ctx.params.id !== onion) { ctx.throw(404, 'Chat not found'); }

    try {
      const [file] = uploadedFiles(ctx.request.files, 'media');
      const media = file ? await uploadedImageToDataUrl(file) : null;
      const text = formValue(ctx.request.body?.text).trim();
      if (!media && !text) {
        throw new PublicError('Write a message or choose an image.', {
          status: 400,
          code: 'empty_message',
        });
      }
      if (text.length > 5000) {
        throw new PublicError('Messages cannot be longer than 5,000 characters.', {
          status: 400,
          code: 'message_too_long',
        });
      }
      await ctx.backend.messages.create({
        sender: customer,
        receiver: onion,
        image_content: media ? Buffer.from(media, 'utf8') : null,
        text_content: media ? null : text,
      });
      if (ctx.get('x-openshop-async') === '1') {
        ctx.status = 201;
        ctx.type = 'text/html; charset=utf-8';
        ctx.body = '<div data-message-sent></div>';
        return;
      }
      redirect(ctx, `/chats/${encodeURIComponent(onion)}`);
    } catch (error) {
      const publicError = toPublicError(error);
      if (ctx.get('x-openshop-async') === '1') {
        ctx.status = publicError.status;
        ctx.type = 'text/html; charset=utf-8';
        ctx.body = `<div data-send-error>${escapeHtml(publicError.message)}</div>`;
        return;
      }
      html(ctx, chatPage({
        chatId: onion,
        basePath: basePath(ctx),
        error: publicError.message,
      }), publicError.status);
    } finally {
      await cleanupUploads(ctx.request.files);
    }
  });

export default () => router.routes();
