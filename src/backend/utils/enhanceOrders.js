import enhanceOrder from './enhanceOrder.js';

export default ({ allOrders, orders, thumbCache }) => (
  Promise.all(
    allOrders.map(
      (order) => enhanceOrder({ order, orders, thumbCache }),
    ),
  )
);
