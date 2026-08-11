import { chatsPage } from '../../shared/pages/chatPages.js';
import indicators from './indicators.js';

export default () => chatsPage({
  status: indicators(),
});
