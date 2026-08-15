import viewConvoThreadPage from '../pages/viewConvoThreadPage.js';
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
  if (ctx.tryCacheEntity(version)) { return; }

  await messages.markAllReadInConvo({
    sender: id,
    receiver: onion,
  });

  const me = onion;
  const chatId = id;

  ctx.body = viewConvoThreadPage({
    allExtMessages: await enhanceExtMessages({
      allExtMessages,
      thumbCache,
      messages,
      orders,
      me,
    }),
    me,
    chatId,
    version,
  });
};
