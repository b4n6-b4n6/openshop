import { CACHE_CONTROL_LIVE } from '../../const.js';
import { chatsVersion } from '../../shared/utils/viewVersions.js';
import viewConvosThreadPage from '../pages/viewConvosThreadPage.js';

export default async (ctx) => {
  const { backend, onionSpinner } = ctx;
  const { onion } = onionSpinner;
  const allConvos = await backend.messages.getConvos(onion);
  const version = chatsVersion(allConvos);

  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }
  ctx.set('Cache-Control', CACHE_CONTROL_LIVE);

  ctx.body = viewConvosThreadPage({
    allConvos,
    version,
  });
};
