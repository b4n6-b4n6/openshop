import { chatPage } from '../../shared/pages/chatPages.js';

export default ({ shopAddress, error = '' }) => chatPage({
  title: shopAddress,
  back: '/browser/',
  action: '/browser/convo',
  thread: '/browser/convo/thread',
  error,
});
