import {
  emptyState,
  productCard,
} from '../../shared/pages/components.js';
import {
  appFrame,
  button,
  document,
  icon,
} from '../../shared/pages/layout.js';
import indicators from './indicators.js';

const viewProductsPage = ({ allProducts }) => document({
  title: 'My Products',
  scripts: ['sound.js'],
  body: appFrame({
    title: 'My Products',
    titleIcon: icon('boxes', 'size-4'),
    back: '/shop',
    status: indicators(),
    content: allProducts.length
      ? `<div class="flex flex-col gap-2.5 px-5 py-5">
        ${allProducts.map((product) => productCard({
    product,
    actionHref: `/shop/products/${product.id}`,
  })).join('')}
      </div>`
      : emptyState({
        emptyIcon: 'boxes',
        title: 'No products yet',
        description: 'Add your first product to start selling.',
      }),
    bottom: button({
      label: 'Add new product',
      href: '/shop/products/new',
      buttonIcon: icon('plus', 'size-4'),
    }),
  }),
});

export default viewProductsPage;
