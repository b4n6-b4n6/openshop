import { CACHE_CONTROL_LIVE, CONVO_PAGE_REFRESH } from '../../const.js';
import { chatThreadPage } from '../../shared/pages/chatPage.js';
import enhanceExtMessages from '../../backend/utils/enhanceExtMessages.js';
import getExtMessages from '../../backend/utils/getExtMessages.js';
import { chatVersion } from '../../shared/utils/viewVersions.js';

export default async (ctx) => {
  const {
    backend, params, thumbCache, onionSpinner,
  } = ctx;
  const { id } = params;
  const { pool, messages, orders } = backend;
  const { onion } = onionSpinner;

  const allExtMessages = await getExtMessages({ pool, customer: id });
  const version = chatVersion(allExtMessages);

  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }
  ctx.set('Cache-Control', CACHE_CONTROL_LIVE);

  await messages.markAllReadInConvo({
    sender: id,
    receiver: onion,
  });

  ctx.body = chatThreadPage({
    allExtMessages: await enhanceExtMessages({
      allExtMessages,
      thumbCache,
      messages,
      orders,
      me: onion,
    }),
    me: onion,
    chatId: id,
    imageBase: '/shop/convos/images',
    orderBase: '/shop/orders',
    version,
    owner: true,
    refresh: CONVO_PAGE_REFRESH,
  });
};
