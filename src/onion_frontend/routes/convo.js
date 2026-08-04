import convoPage from '../pages/convoPage.js';

export default async (ctx) => {
  const { myOnion, backend, state } = ctx;
  const { messages } = backend;
  const { userId } = state.user;

  await messages.markAllReadInConvo({ sender: myOnion, receiver: userId });
  const allMessages = await messages.getConvo([myOnion, userId]);

  ctx.body = convoPage({
    allMessages,
    userId,
  });
};
