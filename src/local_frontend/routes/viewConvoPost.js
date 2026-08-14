import assertImage from '../../utils/assertImage.js';
import createChatMessages from '../../shared/routes/createChatMessages.js';
import viewConvoPage from '../pages/viewConvoPage.js';

export default async (ctx) => {
  const {
    request, onionSpinner, backend, params,
  } = ctx;
  const { id } = params;
  const { onion } = onionSpinner;
  const asyncRequest = ctx.get('x-openshop-async') === '1';

  try {
    const image = request.files?.image?.[0]?.buffer;
    if (image) { await assertImage(image); }

    const result = await createChatMessages({
      messages: backend.messages,
      sender: onion,
      receiver: id,
      text: request.body.text,
      image: request.files?.image?.[0]?.buffer,
    });
    if (result.error) {
      ctx.status = result.status;
      ctx.type = 'text/html; charset=utf-8';
      ctx.body = asyncRequest
        ? `<div data-send-error>${result.error}</div>`
        : viewConvoPage({ userId: id, error: result.error });
      return;
    }

    if (asyncRequest) {
      ctx.status = 201;
      ctx.type = 'text/html; charset=utf-8';
      ctx.body = '<div data-message-sent></div>';
      return;
    }
    ctx.redirect(`/shop/convos/${encodeURIComponent(id)}`);
    ctx.status = 303;
  } catch (error) {
    console.error(error);
    const message = 'The message could not be sent. Try again.';
    ctx.status = 500;
    ctx.type = 'text/html; charset=utf-8';
    ctx.body = asyncRequest
      ? `<div data-send-error>${message}</div>`
      : viewConvoPage({ userId: id, error: message });
  }
};
