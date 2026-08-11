import { chatPage } from '../../shared/pages/chatPages.js';
import { truncateMiddle } from '../../shared/pages/components.js';

export default ({ shopAddress, error = '' }) => chatPage({
  title: truncateMiddle(shopAddress),
  back: '/browser/',
  action: '/browser/convo',
  thread: '/browser/convo/thread',
  error,
});
