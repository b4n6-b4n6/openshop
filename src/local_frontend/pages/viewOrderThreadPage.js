import { ORDER_PAGE_REFRESH } from '../../const.js';
import { orderThreadPage } from '../../shared/pages/orderPage.js';

export default (options) => orderThreadPage({
  ...options,
  owner: true,
  refresh: ORDER_PAGE_REFRESH,
});
