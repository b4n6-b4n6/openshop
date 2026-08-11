import { ORDER_PAGE_REFRESH } from '../../const.js';
import { orderPage } from '../../shared/pages/orderPages.js';

export default (options) => orderPage({
  ...options,
  refresh: ORDER_PAGE_REFRESH,
});
