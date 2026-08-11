import { CACHE_CONTROL_DIRECTIVE } from '../../const.js';
import { chatsVersion } from '../../shared/utils/viewVersions.js';
import viewConvosPage from '../pages/viewConvosPage.js';

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
  ctx.set('Cache-Control', CACHE_CONTROL_DIRECTIVE);

  ctx.body = viewConvosPage({ allConvos, version });
};
