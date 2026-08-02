import viewConvosPage from '../pages/viewConvosPage.js';

export default async (ctx) => {
  const { backend, onionSpinner } = ctx;
  const { messages } = backend;
  const { onion } = onionSpinner;

  const allConvos = await messages.getConvos(onion);

  ctx.body = viewConvosPage({ allConvos });
};
