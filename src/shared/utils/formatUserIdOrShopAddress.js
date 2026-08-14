import truncateMiddle from './truncateMiddle.js';
import formatUserId from '../../utils/formatUserId.js';

export default (v) => (
  v.endsWith('.onion')
    ? truncateMiddle(v)
    : formatUserId(v)
);
