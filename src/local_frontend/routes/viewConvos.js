import { chatListVersion } from '../../shared/utils/viewVersions.js';
import viewConvosPage from '../pages/viewConvosPage.js';

export default async (ctx) => {
  const { backend, onionSpinner } = ctx;
  const { onion } = onionSpinner;
  const allConvos = await backend.messages.getConvos(onion);
  const version = chatListVersion(allConvos);

  ctx.set('Cache-Control', 'no-store');
  ctx.set('ETag', `"${version}"`);
  if (ctx.get('if-none-match') === `"${version}"`) {
    ctx.status = 304;
    return;
  }

  ctx.body = viewConvosPage({ allConvos, version });
};
