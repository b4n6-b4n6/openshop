import { chatsPage } from '../../shared/pages/chatPages.js';
import indicators from './indicators.js';

export default ({ allConvos, version }) => chatsPage({
  chats: allConvos,
  version,
  status: indicators(),
});
