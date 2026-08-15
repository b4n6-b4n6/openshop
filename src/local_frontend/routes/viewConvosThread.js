import { CACHE_CONTROL_LIVE, CONVOS_PAGE_REFRESH } from '../../const.js';
import { chatsVersion } from '../../shared/utils/viewVersions.js';
import { chatsThreadPage } from '../../shared/pages/chatsPage.js';

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

  ctx.body = chatsThreadPage({
    allConvos,
    version,
    refresh: CONVOS_PAGE_REFRESH,
  });
};
