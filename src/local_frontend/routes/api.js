import fs from 'node:fs/promises';
import Router from '@koa/router';
import {
  dataUrlToBuffer,
  fromProduct,
  toChat,
  toMessage,
  toProduct,
  toShop,
} from '../../backend/apiMappers.js';
import { BROWSED_ONION_COOKIE_NAME, MY_SHOP_ONION_PATH } from '../../const.js';
import IsValidOnionHostname from '../utils/IsValidOnionHostname.js';

const router = new Router({ prefix: '/api' });

const readShopAddress = async (ctx) => {
  if (ctx.onionSpinner.onion) { return ctx.onionSpinner.onion; }

  try {
    return (await fs.readFile(MY_SHOP_ONION_PATH, 'utf8')).trim();
  } catch (error) {
    if (error.code === 'ENOENT') { return null; }
    throw error;
  }
};

router
  .get('/status', async (ctx) => {
    ctx.body = {
      wallet: {
        completed: ctx.walletSetup.completed,
        restoring: ctx.walletSetup.restoring,
        error: ctx.walletSetup.lastErrorMessage,
      },
      onion: {
        address: await readShopAddress(ctx),
        spinning: ctx.onionSpinner.spinning,
        progress: ctx.onionSpinner.progress,
      },
    };
  })
  .post('/shop/open', async (ctx) => {
    const { primaryAddress, privateViewKey, restoreHeight } = ctx.request.body ?? {};
    if (!primaryAddress || !privateViewKey || !restoreHeight) {
      ctx.throw(400, 'Wallet address, private view key, and restore height are required');
    }

    ctx.walletSetup.restore({ primaryAddress, privateViewKey, restoreHeight })
      .then(() => {
        if (ctx.walletSetup.completed) { ctx.onionSpinner.spinUp(); }
      });

    ctx.status = 202;
    ctx.body = { status: 'opening' };
  })
  .get('/shop', async (ctx) => {
    const address = await readShopAddress(ctx);
    if (!address) { ctx.throw(404, 'Shop is not open'); }

    ctx.body = toShop(await ctx.backend.shops.get(address), address);
  })
  .patch('/shop', async (ctx) => {
    const address = await readShopAddress(ctx);
    if (!address) { ctx.throw(404, 'Shop is not open'); }

    const current = await ctx.backend.shops.get(address);
    const {
      name = current?.name ?? 'My Shop',
      description = current?.description ?? '',
      profilePhoto,
      bannerPhoto,
    } = ctx.request.body ?? {};

    await ctx.backend.shops.update({
      address,
      name,
      description,
      profile_photo: dataUrlToBuffer(profilePhoto),
      banner_photo: dataUrlToBuffer(bannerPhoto),
    });

    ctx.body = toShop(await ctx.backend.shops.get(address), address);
  })
  .get('/products', async (ctx) => {
    ctx.body = (await ctx.backend.products.getAll()).map(toProduct);
  })
  .get('/products/:id', async (ctx) => {
    const product = await ctx.backend.products.get(ctx.params.id);
    if (!product) { ctx.throw(404, 'Product not found'); }
    ctx.body = toProduct(product);
  })
  .post('/products', async (ctx) => {
    const product = fromProduct(ctx.request.body ?? {});
    const id = await ctx.backend.products.create(product);
    ctx.status = 201;
    ctx.body = toProduct(await ctx.backend.products.get(id));
  })
  .patch('/products/:id', async (ctx) => {
    const current = await ctx.backend.products.get(ctx.params.id);
    if (!current) { ctx.throw(404, 'Product not found'); }

    await ctx.backend.products.update({
      id: ctx.params.id,
      ...fromProduct(ctx.request.body ?? {}),
    });
    ctx.body = toProduct(await ctx.backend.products.get(ctx.params.id));
  })
  .get('/chats', async (ctx) => {
    const address = await readShopAddress(ctx);
    if (!address) { ctx.throw(404, 'Shop is not open'); }
    ctx.body = (await ctx.backend.messages.getConvos(address)).map(toChat);
  })
  .get('/chats/:id/messages', async (ctx) => {
    const address = await readShopAddress(ctx);
    if (!address) { ctx.throw(404, 'Shop is not open'); }
    const messages = await ctx.backend.messages.getConvo([address, ctx.params.id]);
    ctx.body = messages.map((message) => toMessage(message, address, 'owner'));
  })
  .post('/chats/:id/messages', async (ctx) => {
    const address = await readShopAddress(ctx);
    if (!address) { ctx.throw(404, 'Shop is not open'); }
    const { text, media } = ctx.request.body ?? {};
    if (!text && !media) { ctx.throw(400, 'Message content is required'); }

    await ctx.backend.messages.create({
      sender: address,
      receiver: ctx.params.id,
      text_content: text ?? null,
      image_content: dataUrlToBuffer(media),
    });
    const messages = await ctx.backend.messages.getConvo([address, ctx.params.id]);
    ctx.status = 201;
    ctx.body = toMessage(messages.at(-1), address, 'owner');
  })
  .post('/browser', async (ctx) => {
    const onion = String(ctx.request.body?.onion ?? '').trim().toLowerCase();
    if (!IsValidOnionHostname(onion)) { ctx.throw(400, 'Invalid onion address'); }

    ctx.cookies.set(
      BROWSED_ONION_COOKIE_NAME,
      onion,
      { expires: new Date('9999-12-31T23:59:59.999Z') },
    );
    ctx.body = { path: '/browser/' };
  });

export default () => router.routes();
