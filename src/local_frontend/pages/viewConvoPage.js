import { chatPage } from '../../shared/pages/chatPages.js';
import indicators from './indicators.js';

export default ({ userId, error = '' }) => chatPage({
  title: userId,
  back: '/shop/convos',
  action: `/shop/convos/${encodeURIComponent(userId)}`,
  thread: `/shop/convos/${encodeURIComponent(userId)}/thread`,
  owner: true,
  error,
  status: indicators(),
});
