import { CONVO_PAGE_REFRESH, CACHE_CONTROL_LIVE } from '../../const.js';
import { chatThreadPage } from '../../shared/pages/chatPages.js';
import getConversationView from '../../shared/routes/getConversationView.js';
import getConvoAndOrders from '../../backend/utils/getConvoAndOrders.js';
import { chatVersion } from '../../shared/utils/viewVersions.js';

export default async (ctx) => {
  const {
    state, backend, thumbnailCache, myOnion,
  } = ctx;
  const { userId } = state.user;

  const { pool } = backend;
  const allExtMessages = await getConvoAndOrders({ pool, customer: userId });
  const version = chatVersion(allExtMessages);

  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }
  ctx.set('Cache-Control', CACHE_CONTROL_LIVE);

  await backend.messages.markAllReadInConvo({
    sender: myOnion,
    receiver: userId,
  });

  ctx.body = chatThreadPage({
    allExtMessages: await getConversationView({
      backend,
      allExtMessages,
      thumbnailCache,
      me: userId,
    }),
    me: userId,
    chatId: myOnion,
    imageBase: '/browser/convo/images',
    orderBase: '/browser/orders',
    version,
    refresh: CONVO_PAGE_REFRESH,
  });
};
