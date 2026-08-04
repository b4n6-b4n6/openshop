export default async (ctx) => {
  const {
    request, onionSpinner, backend, params,
  } = ctx;
  const { messages } = backend;

  const { id } = params;
  const { onion } = onionSpinner;
  const { text } = request.body;
  const image = ctx.request.files?.image?.[0]?.buffer;

  if (text) {
    await messages.create({
      sender: onion,
      receiver: id,
      text_content: text,
    });
  } else if (image) {
    await messages.create({
      sender: onion,
      receiver: id,
      image_content: image,
    });
  }

  ctx.redirect(`/shop/convos/${id}`);
};
