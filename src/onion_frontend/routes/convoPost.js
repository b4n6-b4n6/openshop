import convoPage from '../pages/convoPage.js';
import assertMessage from '../../utils/assertMessage.js';

export default async (ctx) => {
  const {
    request, state, backend, myOnion,
  } = ctx;
  const { userId } = state.user;
  const { messages } = backend;

  try {
    const text_content = request.body.text?.trim() || null;
    const image_content = request.files?.image?.[0]?.buffer;

    await assertMessage({ text_content, image_content });
    await messages.create({
      sender: userId,
      receiver: myOnion,
      text_content,
      image_content,
    });

    ctx.redirectWith303('/browser/convo');
  } catch (error) {
    console.error(error);
    ctx.body = convoPage({
      error: 'The message could not be sent. Try again.',
      shopAddress: myOnion,
    });
  }
};

// Choose a valid PNG, JPEG, WebP, or GIF image.
// Write a message or choose an image.
