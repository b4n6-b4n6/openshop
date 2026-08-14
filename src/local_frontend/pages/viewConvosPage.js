import { chatsPage } from '../../shared/pages/chatsPage.js';
import indicators from './indicators.js';

export default () => chatsPage({
  status: indicators(),
});
