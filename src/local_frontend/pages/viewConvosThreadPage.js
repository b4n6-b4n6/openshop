import { CONVOS_PAGE_REFRESH } from '../../const.js';
import { chatsThreadPage } from '../../shared/pages/chatsPage.js';

export default ({ allConvos, version }) => (
  chatsThreadPage({
    allConvos,
    version,
    refresh: CONVOS_PAGE_REFRESH,
  })
);
