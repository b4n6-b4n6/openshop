import Router from '@koa/router';
import {
  dataUrlToBuffer,
  toChat,
  toMessage,
  toProduct,
  toShop,
} from '../../backend/apiMappers.js';
import readMyShopAddress from '../utils/readMyShopAddress.js';

const router = new Router({ prefix: '/api' });

router
  .get('/shop', async (ctx) => {
    const address = await readMyShopAddress();
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
  .get('/chats', async (ctx) => {
    const address = await readMyShopAddress();
    const customer = ctx.state.user?.userId;
    if (!customer) { ctx.throw(401, 'Customer identity is required'); }
    const chat = (await ctx.backend.messages.getConvos(customer))
      .find(({ id }) => id === address);
    ctx.body = [chat ? toChat(chat) : {
      id: address,
      lastMessageAt: Date.now(),
      unread: false,
    }];
  })
  .get('/chats/:id/messages', async (ctx) => {
    const address = await readMyShopAddress();
    const customer = ctx.state.user?.userId;
    if (!customer) { ctx.throw(401, 'Customer identity is required'); }
    const messages = await ctx.backend.messages.getConvo([address, customer]);
    ctx.body = messages.map((message) => toMessage(message, customer, 'customer'));
  })
  .post('/chats/:id/messages', async (ctx) => {
    const address = await readMyShopAddress();
    const customer = ctx.state.user?.userId;
    if (!customer) { ctx.throw(401, 'Customer identity is required'); }
    const { text, media } = ctx.request.body ?? {};
    if (!text && !media) { ctx.throw(400, 'Message content is required'); }

    await ctx.backend.messages.create({
      sender: customer,
      receiver: address,
      text_content: text ?? null,
      image_content: dataUrlToBuffer(media),
    });
    const messages = await ctx.backend.messages.getConvo([address, customer]);
    ctx.status = 201;
    ctx.body = toMessage(messages.at(-1), customer, 'customer');
  });

export default () => router.routes();
