import assertImage from '../../utils/assertImage.js';
import createChatMessages from '../../shared/routes/createChatMessages.js';
import convoPage from '../pages/convoPage.js';

export default async (ctx) => {
  const {
    request, state, backend, myOnion,
  } = ctx;
  const { userId } = state.user;
  const asyncRequest = ctx.get('x-openshop-async') === '1';

  try {
    const image = request.files?.image?.[0]?.buffer;
    if (image) { await assertImage(image); }

    const result = await createChatMessages({
      messages: backend.messages,
      sender: userId,
      receiver: myOnion,
      text: request.body.text,
      image,
    });
    if (result.error) {
      ctx.status = result.status;
      ctx.type = 'text/html; charset=utf-8';
      ctx.body = asyncRequest
        ? `<div data-send-error>${result.error}</div>`
        : convoPage({ shopAddress: myOnion, error: result.error });
      return;
    }

    if (asyncRequest) {
      ctx.status = 201;
      ctx.type = 'text/html; charset=utf-8';
      ctx.body = '<div data-message-sent></div>';
      return;
    }
    ctx.redirect('/browser/convo');
    ctx.status = 303;
  } catch (error) {
    console.error(error);
    const message = 'The message could not be sent. Try again.';
    ctx.status = 500;
    ctx.type = 'text/html; charset=utf-8';
    ctx.body = asyncRequest
      ? `<div data-send-error>${message}</div>`
      : convoPage({ shopAddress: myOnion, error: message });
  }
};
