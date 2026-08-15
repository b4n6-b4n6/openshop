import viewConvoPage from '../pages/viewConvoPage.js';
import assertMessage from '../../utils/assertMessage.js';

export default async (ctx) => {
  const {
    request, onionSpinner, backend, params,
  } = ctx;
  const { id } = params;
  const { onion } = onionSpinner;
  const { messages } = backend;

  try {
    const text_content = request.body.text?.trim() || null;
    const image_content = request.files?.image?.[0]?.buffer;

    await assertMessage({ text_content, image_content });
    await messages.create({
      sender: onion,
      receiver: id,
      text_content,
      image_content,
    });

    ctx.redirect(`/shop/convos/${encodeURIComponent(id)}`);
  } catch (error) {
    console.error(error);
    ctx.body = viewConvoPage({
      error: 'The message could not be sent. Try again.',
      userId: id,
    });
  }
};

// Choose a valid PNG, JPEG, WebP, or GIF image.
// Write a message or choose an image.
