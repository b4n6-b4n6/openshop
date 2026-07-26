import fs from 'node:fs/promises';
import moneroTs from 'monero-ts';
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
import { PublicError } from '../../utils/publicError.js';
import { isSafeDataImage } from '../../shared/utils/uploads.js';

const router = new Router({ prefix: '/api' });

const readWalletSyncState = async (ctx) => {
  if (ctx.walletSetup.lastError || ctx.onionSpinner.lastError) { return 'error'; }
  if (!ctx.walletSetup.completed) { return null; }
  if (!ctx.onionSpinner.onion) { return 'syncing'; }

  try {
    const response = await fetch('http://127.0.0.1:7007/internal/status', {
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) { return 'error'; }
    const status = await response.json();
    return ['synced', 'syncing', 'error'].includes(status.wallet)
      ? status.wallet
      : 'error';
  } catch (error) {
    console.error('Could not read onion wallet status', error);
    return 'error';
  }
};

const connectivityState = (onionSpinner) => {
  if (onionSpinner.lastError) { return 'offline'; }
  if (onionSpinner.spinning) { return 'checking'; }
  return onionSpinner.onion ? 'online' : 'offline';
};

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
    const address = ctx.onionSpinner.onion;
    const connectivity = connectivityState(ctx.onionSpinner);

    ctx.body = {
      connectivity,
      wallet: {
        completed: ctx.walletSetup.completed,
        restoring: ctx.walletSetup.restoring,
        error: ctx.walletSetup.lastError,
        sync: await readWalletSyncState(ctx),
      },
      onion: {
        address,
        spinning: ctx.onionSpinner.spinning,
        progress: ctx.onionSpinner.progress,
        error: ctx.onionSpinner.lastError,
      },
    };
  })
  .post('/shop/open', async (ctx) => {
    const primaryAddress = String(ctx.request.body?.primaryAddress ?? '').trim();
    const privateViewKey = String(ctx.request.body?.privateViewKey ?? '').trim();
    const restoreHeight = String(ctx.request.body?.restoreHeight ?? '').trim();
    if (!primaryAddress || !privateViewKey || !restoreHeight) {
      throw new PublicError(
        'Wallet address, private view key, and restore height are required.',
        { status: 400, code: 'missing_wallet_details' },
      );
    }
    if (!/^4[1-9A-HJ-NP-Za-km-z]{94}$/.test(primaryAddress)
      || !await moneroTs.MoneroUtils.isValidAddress(
        primaryAddress,
        moneroTs.MoneroNetworkType.MAINNET,
      )) {
      throw new PublicError(
        'Enter a valid 95-character Monero mainnet primary address beginning with 4.',
        { status: 400, code: 'invalid_wallet_address', field: 'primaryAddress' },
      );
    }
    if (!/^[0-9a-fA-F]{64}$/.test(privateViewKey)) {
      throw new PublicError(
        'The private view key is invalid. Enter a 64-character hexadecimal Monero view key.',
        { status: 400, code: 'invalid_view_key', field: 'privateViewKey' },
      );
    }
    if (!/^\d+$/.test(String(restoreHeight))) {
      throw new PublicError(
        'Restore block height must be a non-negative whole number.',
        { status: 400, code: 'invalid_restore_height', field: 'restoreHeight' },
      );
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
    ctx.body = (await ctx.backend.messages.getConvos(address))
      .map((chat) => toChat(chat, address, 'owner'));
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
    if (text && String(text).length > 5000) {
      throw new PublicError('Messages cannot be longer than 5,000 characters.', {
        status: 400,
        code: 'message_too_long',
      });
    }
    if (media && !isSafeDataImage(media)) {
      throw new PublicError('The message image is invalid or larger than 2 MB.', {
        status: 415,
        code: 'invalid_image',
      });
    }

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
