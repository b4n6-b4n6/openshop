import { CONVO_PAGE_REFRESH } from '../../const.js';
import { chatThreadPage } from '../../shared/pages/chatPages.js';
import getConversationView from '../../shared/routes/getConversationView.js';

export default async (ctx) => {
  const {
    state, backend, thumbnailCache, myOnion,
  } = ctx;
  const { userId } = state.user;

  await backend.messages.markAllReadInConvo({
    sender: myOnion,
    receiver: userId,
  });
  const { allExtMessages, version } = await getConversationView({
    backend,
    customer: userId,
    thumbnailCache,
  });

  ctx.set('Cache-Control', 'no-store');
  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }

  ctx.body = chatThreadPage({
    allExtMessages,
    me: userId,
    chatId: myOnion,
    imageBase: '/browser/convo/images',
    orderBase: '/browser/orders',
    version,
    refresh: CONVO_PAGE_REFRESH,
  });
};
