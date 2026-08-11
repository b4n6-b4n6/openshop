import { CONVO_PAGE_REFRESH } from '../../const.js';
import { chatThreadPage } from '../../shared/pages/chatPages.js';
import getConversationView from '../../shared/routes/getConversationView.js';

export default async (ctx) => {
  const {
    backend, params, thumbnailCache, onionSpinner,
  } = ctx;
  const { id } = params;
  const { onion } = onionSpinner;

  await backend.messages.markAllReadInConvo({
    sender: id,
    receiver: onion,
  });
  const { allExtMessages, version } = await getConversationView({
    backend,
    customer: id,
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
    me: onion,
    chatId: id,
    imageBase: '/shop/convos/images',
    orderBase: '/shop/orders',
    version,
    owner: true,
    refresh: CONVO_PAGE_REFRESH,
  });
};
