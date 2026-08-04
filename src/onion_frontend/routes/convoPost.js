export default async (ctx) => {
  const { request, state, backend } = ctx;
  const { messages } = backend;

  const { myOnion } = ctx;
  const { userId } = state.user;
  const { text } = request.body;
  const image = request.files?.image?.[0]?.buffer;

  if (text) {
    await messages.create({
      sender: userId,
      receiver: myOnion,
      text_content: text,
    });
  } else if (image) {
    await messages.create({
      sender: userId,
      receiver: myOnion,
      image_content: image,
    });
  }

  ctx.redirect('/browser/convo');
};
