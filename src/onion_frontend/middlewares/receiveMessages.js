export default () => async (ctx, next) => {
  const { userId } = ctx.state.user;
  await ctx.backend.messages.markAllReceivedInConvo({
    sender: ctx.myOnion,
    receiver: userId,
  });
  await next();
};
