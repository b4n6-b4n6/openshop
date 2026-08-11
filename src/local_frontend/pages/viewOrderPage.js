import { ORDER_PAGE_REFRESH } from '../../const.js';
import { orderPage } from '../../shared/pages/orderPages.js';
import indicators from './indicators.js';

export default (options) => orderPage({
  ...options,
  owner: true,
  status: indicators(),
  refresh: ORDER_PAGE_REFRESH,
});
