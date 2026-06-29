import IsValidOnion from '../utils/IsValidOnion.js';

export default async (ctx) => {
  const { session, request } = ctx;
  const { onion } = request.body;

  if (IsValidOnion(onion)) {
    session.onion = onion;

    ctx.status = 200;
    ctx.body = 'OK';
  } else {
    ctx.status = 500;
    ctx.body = 'NOT A VALID ONION';
  }
};
