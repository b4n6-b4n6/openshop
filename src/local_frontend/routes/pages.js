import moneroTs from 'monero-ts';
import Router from '@koa/router';
import QRCode from 'qrcode';
import { BROWSED_ONION_COOKIE_NAME } from '../../const.js';
import { PublicError, toPublicError } from '../../utils/publicError.js';
import {
  cleanupUploads,
  embedUploadedImages,
  uploadedFiles,
  uploadedImageToDataUrl,
} from '../../shared/utils/uploads.js';
import {
  escapeAttribute,
  escapeHtml,
  formValue,
} from '../../shared/utils/html.js';
import IsValidOnionHostname from '../utils/IsValidOnionHostname.js';
import readShopAddress from '../utils/readShopAddress.js';
import {
  browseErrorPage,
  browsePage,
  createShopPage,
  editShopPage,
  openingPage,
  ownerShopPage,
  productFormPage,
  productsPage,
  simpleListPage,
  welcomePage,
} from '../pages/app.js';
import {
  chatPage,
  chatsPage,
  chatThreadPage,
} from '../../shared/pages/chatPages.js';
import { orderCard } from '../../shared/pages/components.js';

const router = new Router();

const html = (ctx, body, status = 200) => {
  ctx.status = status;
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = body;
};

const redirect = (ctx, path) => {
  ctx.redirect(path);
  ctx.status = 303;
};

const walletValues = (body = {}) => ({
  primaryAddress: formValue(body.primaryAddress).trim(),
  privateViewKey: formValue(body.privateViewKey).trim(),
  restoreHeight: formValue(body.restoreHeight).trim(),
});

const validateWallet = async (values) => {
  const errors = {};
  if (!/^4[1-9A-HJ-NP-Za-km-z]{94}$/.test(values.primaryAddress)
    || !await moneroTs.MoneroUtils.isValidAddress(
      values.primaryAddress,
      moneroTs.MoneroNetworkType.MAINNET,
    )) {
    errors.primaryAddress = 'Enter a valid 95-character Monero mainnet primary address beginning with 4';
  }
  if (!/^[0-9a-fA-F]{64}$/.test(values.privateViewKey)) {
    errors.privateViewKey = 'Enter a 64-character hexadecimal private view key';
  }
  if (!/^\d+$/.test(values.restoreHeight)) {
    errors.restoreHeight = 'Enter a non-negative whole number';
  }
  return errors;
};

const readUploadedImages = async (ctx, field, max = 1) => {
  const files = uploadedFiles(ctx.request.files, field);
  if (files.length > max) {
    throw new PublicError(`Only ${max} image${max === 1 ? '' : 's'} may be uploaded here.`, {
      status: 400,
      code: 'too_many_images',
    });
  }
  return Promise.all(files.map((file) => uploadedImageToDataUrl(file)));
};

const productValues = (body = {}, current = {}) => ({
  id: current.id,
  name: formValue(body.name, current.name).trim(),
  description: formValue(body.description, current.description),
  currency: formValue(body.currency, current.currency ?? 'USD').toUpperCase(),
  price: formValue(body.price, current.price),
  available_quantity: Number(formValue(
    body.quantity,
    current.available_quantity ?? 1,
  )),
});

const validateProduct = (product) => {
  if (!product.name) {
    throw new PublicError('Product name is required.', {
      status: 400,
      code: 'missing_product_name',
    });
  }
  const price = Number(product.price);
  if (!Number.isFinite(price) || price <= 0 || price > 999.99) {
    throw new PublicError('Enter a price between 0.01 and 999.99.', {
      status: 400,
      code: 'invalid_price',
    });
  }
  if (!Number.isInteger(product.available_quantity) || product.available_quantity < 0) {
    throw new PublicError('Quantity must be a non-negative whole number.', {
      status: 400,
      code: 'invalid_quantity',
    });
  }
};

const saveRichDescription = async (ctx, rawDescription) => {
  const inline = await readUploadedImages(ctx, 'inlineImages', 5);
  return embedUploadedImages(rawDescription, inline);
};

router
  .get('/', async (ctx) => {
    if (ctx.walletSetup.lastError || ctx.onionSpinner.lastError) {
      redirect(ctx, '/create/opening');
    } else if (ctx.walletSetup.restoring || ctx.walletSetup.completed) {
      redirect(ctx, ctx.onionSpinner.onion ? '/shop' : '/create/opening');
    } else {
      redirect(ctx, '/welcome');
    }
  })
  .get('/welcome', (ctx) => html(ctx, welcomePage()))
  .get('/browse', (ctx) => html(ctx, browsePage({
    onion: ctx.cookies.get(BROWSED_ONION_COOKIE_NAME) ?? '',
  })))
  .post('/browse', (ctx) => {
    const onion = formValue(ctx.request.body?.onion).trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '');
    if (!IsValidOnionHostname(onion)) {
      html(ctx, browsePage({
        onion,
        error: 'Enter a valid 56-character v3 onion address ending in .onion.',
      }), 400);
      return;
    }

    ctx.cookies.set(BROWSED_ONION_COOKIE_NAME, onion, {
      expires: new Date('9999-12-31T23:59:59.999Z'),
      httpOnly: true,
      sameSite: 'lax',
    });
    redirect(ctx, '/browser/');
  })
  .get('/browse/error', (ctx) => {
    const message = formValue(
      ctx.query.message,
      'The onion shop could not be reached. It may be offline.',
    );
    html(ctx, browseErrorPage(message));
  })
  .get('/create', (ctx) => html(ctx, createShopPage()))
  .post('/create', async (ctx) => {
    const values = walletValues(ctx.request.body);
    const errors = await validateWallet(values);
    if (Object.keys(errors).length > 0) {
      html(ctx, createShopPage({ values, errors }), 400);
      return;
    }

    ctx.walletSetup.restore(values).then(() => {
      if (ctx.walletSetup.completed) { ctx.onionSpinner.spinUp(); }
    });
    redirect(ctx, '/create/opening');
  })
  .get('/create/opening', (ctx) => {
    if (ctx.walletSetup.lastError) {
      html(ctx, openingPage({
        state: 'error',
        message: ctx.walletSetup.lastError.message,
      }), 500);
      return;
    }
    if (ctx.onionSpinner.lastError) {
      html(ctx, openingPage({
        state: 'error',
        message: ctx.onionSpinner.lastError.message,
      }), 500);
      return;
    }
    if (ctx.onionSpinner.onion) {
      redirect(ctx, '/shop');
      return;
    }

    const restoring = !ctx.walletSetup.completed;
    html(ctx, openingPage({
      state: restoring ? 'wallet' : 'tor',
      message: restoring
        ? 'Restoring the view-only Monero wallet on this device.'
        : 'Publishing your self-hosted shop through Tor.',
      progress: restoring ? 0 : ctx.onionSpinner.progress,
    }));
  })
  .get('/shop', async (ctx) => {
    const onion = await readShopAddress(ctx);
    if (!onion) {
      redirect(ctx, '/create/opening');
      return;
    }
    const chats = await ctx.backend.messages.getConvos(onion);
    html(ctx, ownerShopPage({
      onion,
      shop: await ctx.backend.shops.get(onion),
      qr: await QRCode.toDataURL(onion, {
        margin: 1,
        width: 240,
        errorCorrectionLevel: 'H',
        color: { dark: '#0f1115', light: '#ffffff' },
      }),
      hasUnread: chats.some(({ unread }) => unread),
    }));
  })
  .get('/shop/chat-status', async (ctx) => {
    const onion = await readShopAddress(ctx);
    if (!onion) { ctx.throw(409, 'Shop is not open'); }
    const state = await ctx.backend.messages.getNotificationState(onion);
    ctx.set('Cache-Control', 'no-store');
    html(ctx, `<div data-chat-status data-latest-incoming="${escapeAttribute(state.latestIncomingId ?? '')}">
      ${state.unreadChatIds.map(
    (id) => `<span data-unread-chat="${escapeAttribute(id)}"></span>`,
  ).join('')}
    </div>`);
  })
  .get('/shop/edit', async (ctx) => {
    const onion = await readShopAddress(ctx);
    if (!onion) {
      redirect(ctx, '/create/opening');
      return;
    }
    html(ctx, editShopPage({
      shop: await ctx.backend.shops.get(onion) ?? {
        name: 'My Shop',
        description: '',
      },
    }));
  })
  .post('/shop/edit', async (ctx) => {
    const onion = await readShopAddress(ctx);
    if (!onion) { ctx.throw(409, 'Shop is not open'); }

    const current = await ctx.backend.shops.get(onion) ?? {};
    const draft = {
      name: formValue(ctx.request.body?.name, current.name ?? 'My Shop').trim(),
      description: formValue(ctx.request.body?.description, current.description ?? ''),
    };

    try {
      if (!draft.name) {
        throw new PublicError('Shop name is required.', {
          status: 400,
          code: 'missing_shop_name',
        });
      }
      draft.description = await saveRichDescription(ctx, draft.description);
      const [profilePhoto] = await readUploadedImages(ctx, 'profilePhoto');
      const [bannerPhoto] = await readUploadedImages(ctx, 'bannerPhoto');
      await ctx.backend.shops.update({
        address: onion,
        name: draft.name,
        description: draft.description,
        profile_photo: profilePhoto ? Buffer.from(profilePhoto, 'utf8') : null,
        banner_photo: bannerPhoto ? Buffer.from(bannerPhoto, 'utf8') : null,
      });
      redirect(ctx, '/shop');
    } catch (error) {
      const publicError = toPublicError(error);
      html(ctx, editShopPage({
        shop: { ...current, ...draft },
        error: publicError.message,
      }), publicError.status);
    } finally {
      await cleanupUploads(ctx.request.files);
    }
  })
  .get('/shop/products', async (ctx) => {
    html(ctx, productsPage({
      products: await ctx.backend.products.getAll(),
    }));
  })
  .get('/shop/products/new', (ctx) => html(ctx, productFormPage({})))
  .post('/shop/products/new', async (ctx) => {
    const draft = productValues(ctx.request.body);
    try {
      validateProduct(draft);
      draft.description = await saveRichDescription(ctx, draft.description);
      const [photo] = await readUploadedImages(ctx, 'photo');
      const id = await ctx.backend.products.create({
        ...draft,
        price: Number(draft.price),
        currency: draft.currency.toLowerCase(),
        photo: photo ? Buffer.from(photo, 'utf8') : null,
      });
      if (!id) { throw new Error('Product was not created'); }
      redirect(ctx, '/shop/products');
    } catch (error) {
      const publicError = toPublicError(error);
      html(ctx, productFormPage({
        product: draft,
        error: publicError.message,
      }), publicError.status);
    } finally {
      await cleanupUploads(ctx.request.files);
    }
  })
  .get('/shop/products/:id/edit', async (ctx) => {
    const product = await ctx.backend.products.get(ctx.params.id);
    if (!product) { ctx.throw(404, 'Product not found'); }
    html(ctx, productFormPage({ product, edit: true }));
  })
  .post('/shop/products/:id/edit', async (ctx) => {
    const current = await ctx.backend.products.get(ctx.params.id);
    if (!current) { ctx.throw(404, 'Product not found'); }
    const draft = productValues(ctx.request.body, current);

    try {
      validateProduct(draft);
      draft.description = await saveRichDescription(ctx, draft.description);
      const [photo] = await readUploadedImages(ctx, 'photo');
      await ctx.backend.products.update({
        ...draft,
        price: Number(draft.price),
        currency: draft.currency.toLowerCase(),
        photo: photo ? Buffer.from(photo, 'utf8') : null,
      });
      redirect(ctx, '/shop/products');
    } catch (error) {
      const publicError = toPublicError(error);
      html(ctx, productFormPage({
        product: draft,
        edit: true,
        error: publicError.message,
      }), publicError.status);
    } finally {
      await cleanupUploads(ctx.request.files);
    }
  })
  .get('/shop/orders', async (ctx) => {
    const orders = await ctx.backend.orders.getAllForShop();
    html(ctx, simpleListPage({
      title: 'My Orders',
      back: '/shop',
      content: orders.length
        ? `<div class="flex flex-col gap-2.5 px-5 py-5">${orders.map(
          (order) => orderCard({ order }),
        ).join('')}</div>`
        : '',
      empty: {
        emptyIcon: 'receipt',
        title: 'No orders yet',
        description: 'Customer purchases will appear here.',
      },
    }));
  })
  .get('/shop/chats', async (ctx) => {
    const onion = await readShopAddress(ctx);
    if (!onion) { ctx.throw(409, 'Shop is not open'); }
    html(ctx, chatsPage({
      chats: await ctx.backend.messages.getConvos(onion),
      owner: true,
    }));
  })
  .get('/shop/chats/:id', async (ctx) => {
    const onion = await readShopAddress(ctx);
    if (!onion) { ctx.throw(409, 'Shop is not open'); }
    html(ctx, chatPage({
      chatId: ctx.params.id,
      owner: true,
    }));
  })
  .get('/shop/chats/:id/thread', async (ctx) => {
    const onion = await readShopAddress(ctx);
    if (!onion) { ctx.throw(409, 'Shop is not open'); }
    await ctx.backend.messages.markAllReadInConvo({
      sender: ctx.params.id,
      receiver: onion,
    });
    const messages = await ctx.backend.messages.getConvo([onion, ctx.params.id]);
    const version = messages.at(-1)?.id ?? 'empty';
    ctx.set('Cache-Control', 'no-store');
    ctx.set('ETag', `"${version}"`);
    if (ctx.get('if-none-match') === `"${version}"`) {
      ctx.status = 304;
      return;
    }
    html(ctx, chatThreadPage({
      messages,
      me: onion,
      chatId: ctx.params.id,
    }));
  })
  .post('/shop/chats/:id/messages', async (ctx) => {
    const onion = await readShopAddress(ctx);
    if (!onion) { ctx.throw(409, 'Shop is not open'); }

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
        sender: onion,
        receiver: ctx.params.id,
        image_content: media ? Buffer.from(media, 'utf8') : null,
        text_content: media ? null : text,
      });
      if (ctx.get('x-openshop-async') === '1') {
        ctx.status = 201;
        ctx.type = 'text/html; charset=utf-8';
        ctx.body = '<div data-message-sent></div>';
        return;
      }
      redirect(ctx, `/shop/chats/${encodeURIComponent(ctx.params.id)}`);
    } catch (error) {
      const publicError = toPublicError(error);
      if (ctx.get('x-openshop-async') === '1') {
        ctx.status = publicError.status;
        ctx.type = 'text/html; charset=utf-8';
        ctx.body = `<div data-send-error>${escapeHtml(publicError.message)}</div>`;
        return;
      }
      html(ctx, chatPage({
        chatId: ctx.params.id,
        owner: true,
        error: publicError.message,
      }), publicError.status);
    } finally {
      await cleanupUploads(ctx.request.files);
    }
  });

export default () => router.routes();
