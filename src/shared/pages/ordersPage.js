import { emptyState, orderCard } from './components.js';
import { appFrame, document, icon } from './layout.js';

const ownerScripts = ['sound.js'];

export const ordersPage = ({ owner = false, status = '' }) => (
  document({
    title: owner ? 'My Orders' : 'Orders',
    scripts: owner ? ownerScripts : [],
    body: appFrame({
      title: owner ? 'My Orders' : 'Orders',
      titleIcon: icon('receipt', 'size-4'),
      back: owner ? '/shop' : '/browser/',
      status,
      animate: false,
      content: (
        `<iframe
          title="Orders"
          src="${owner ? '/shop/orders/thread' : '/browser/orders/thread'}"
          class="live-frame h-full w-full border-0 bg-base"
        ></iframe>`
      ),
    }),
  })
);

export const ordersThreadPage = ({
  allOrders, owner = false, refresh,
}) => {
  const root = owner ? '/shop/orders' : '/browser/orders';

  return document({
    title: 'Orders',
    scripts: [],
    body: (
      `<div class="live-body">
        ${(allOrders.length
        ? (
          `<div class="flex flex-col gap-2.5 px-5 py-5">${(
            allOrders.map((order) => orderCard({
              order,
              href: `${root}/${encodeURIComponent(order.id)}`,
            })).join('')
          )}</div>`
        )
        : (
          emptyState({
            emptyIcon: 'receipt',
            title: 'No orders yet',
            description: owner
              ? 'Customer purchases will appear here.'
              : 'Your purchases will appear here.',
          })
        ))}
      </div>`
    ),
    refresh,
  });
};
