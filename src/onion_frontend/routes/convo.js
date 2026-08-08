import convoPage from '../pages/convoPage.js';

export default async (ctx) => {
  ctx.body = convoPage({ shopAddress: ctx.myOnion });
};
