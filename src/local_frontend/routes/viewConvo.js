import viewConvoPage from '../pages/viewConvoPage.js';

export default async (ctx) => {
  const { onionSpinner, backend, params } = ctx;
  const { messages } = backend;
  const { id } = params;
  const { onion } = onionSpinner;

  await messages.markAllReadInConvo({ sender: id, receiver: onion });
  const allMessages = await messages.getConvo([id, onion]);

  ctx.body = viewConvoPage({
    allMessages,
    userId: id,
  });
};
