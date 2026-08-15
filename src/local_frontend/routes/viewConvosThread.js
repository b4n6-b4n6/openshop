import { chatsVersion } from '../../shared/utils/viewVersions.js';
import viewConvosThreadPage from '../pages/viewConvosThreadPage.js';

export default async (ctx) => {
  const { backend, onionSpinner } = ctx;
  const { onion } = onionSpinner;

  const allConvos = await backend.messages.getConvos(onion);
  const version = chatsVersion(allConvos);
  if (ctx.tryCacheEntity(version)) { return; }

  ctx.body = viewConvosThreadPage({
    allConvos,
    version,
  });
};
