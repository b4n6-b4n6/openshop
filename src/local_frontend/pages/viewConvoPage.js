import { chatPage } from '../../shared/pages/chatPage.js';
import formatUserId from '../../utils/formatUserId.js';
import indicators from './indicators.js';

export default ({ userId, error = '' }) => chatPage({
  title: formatUserId(userId),
  back: '/shop/convos',
  action: `/shop/convos/${encodeURIComponent(userId)}`,
  thread: `/shop/convos/${encodeURIComponent(userId)}/thread`,
  owner: true,
  error,
  status: indicators(),
});
