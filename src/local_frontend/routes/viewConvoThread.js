import { CACHE_CONTROL_LIVE, CONVO_PAGE_REFRESH } from '../../const.js';
import { chatThreadPage } from '../../shared/pages/chatPage.js';
import getConversationView from '../../shared/routes/getConversationView.js';
import getConvoAndOrders from '../../backend/utils/getConvoAndOrders.js';
import { chatVersion } from '../../shared/utils/viewVersions.js';

export default async (ctx) => {
  const {
    backend, params, thumbnailCache, onionSpinner,
  } = ctx;
  const { id } = params;
  const { pool } = backend;
  const { onion } = onionSpinner;

  const allExtMessages = await getConvoAndOrders({ pool, customer: id });
  const version = chatVersion(allExtMessages);

  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }
  ctx.set('Cache-Control', CACHE_CONTROL_LIVE);

  await backend.messages.markAllReadInConvo({
    sender: id,
    receiver: onion,
  });

  ctx.body = chatThreadPage({
    allExtMessages: await getConversationView({
      backend,
      allExtMessages,
      thumbnailCache,
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
