import chatThreadPage from '../pages/convoThreadPage.js';
import enhanceExtMessages from '../../backend/utils/enhanceExtMessages.js';
import getExtMessages from '../../backend/utils/getExtMessages.js';
import { chatVersion } from '../../shared/utils/viewVersions.js';

export default async (ctx) => {
  const {
    state, backend, thumbCache, myOnion,
  } = ctx;
  const { userId } = state.user;
  const { pool, messages, orders } = backend;

  const allExtMessages = await getExtMessages({ pool, customer: userId });
  const version = chatVersion(allExtMessages);
  if (ctx.tryCacheEntity(version)) { return; }

  await messages.markAllReadInConvo({
    sender: myOnion,
    receiver: userId,
  });

  const me = userId;
  const chatId = myOnion;

  ctx.body = chatThreadPage({
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
