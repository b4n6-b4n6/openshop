import {
  photoField,
  richEditor,
  selectCurrency,
} from '../../shared/pages/components.js';
import {
  appFrame,
  button,
  document,
  field,
  icon,
} from '../../shared/pages/layout.js';
import indicators from './indicators.js';

const newProductPage = () => document({
  title: 'Add Product',
  scripts: ['editor.js', 'owner.js'],
  body: appFrame({
    title: 'Add Product',
    back: '/shop/products',
    status: indicators(),
    content: `<form id="product-form" action="/shop/products/new" method="post" enctype="multipart/form-data" data-disable-on-submit class="space-y-5 px-5 py-6">
      ${field({
    label: 'Name',
    name: 'name',
    placeholder: 'Product name',
    attributes: 'required',
  })}
      ${richEditor({ label: 'Description' })}
      ${photoField({ label: 'Product photo' })}
      ${selectCurrency()}
      ${field({
    label: 'Price',
    name: 'price',
    placeholder: '0.00',
    attributes: 'type="number" inputmode="decimal" step="0.01" min="0" required',
  })}
      ${field({
    label: 'Available quantity',
    name: 'available_quantity',
    value: '1',
    attributes: 'type="number" inputmode="numeric" min="0" required',
  })}
    </form>`,
    bottom: button({
      label: 'Add product',
      type: 'submit',
      buttonIcon: icon('plus', 'size-4'),
      attributes: 'form="product-form"',
    }),
  }),
});

export default newProductPage;
