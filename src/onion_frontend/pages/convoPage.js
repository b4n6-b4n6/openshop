import { chatPage } from '../../shared/pages/chatPage.js';
import truncateMiddle from '../../shared/utils/truncateMiddle.js';

export default ({ shopAddress, error = '' }) => chatPage({
  title: truncateMiddle(shopAddress),
  back: '/browser/',
  action: '/browser/convo',
  thread: '/browser/convo/thread',
  error,
});
