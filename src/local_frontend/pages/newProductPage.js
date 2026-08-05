import {
  photoField,
  richEditor,
  selectCurrency,
} from '../../shared/pages/components.js';
import {
  appFrame,
  button,
  document,
  errorNotice,
  field,
  icon,
} from '../../shared/pages/layout.js';
import indicators from './indicators.js';

const newProductPage = ({ error = '', values = {} } = {}) => document({
  title: 'Add Product',
  scripts: ['editor.js', 'owner.js'],
  body: appFrame({
    title: 'Add Product',
    back: '/shop/products',
    status: indicators(),
    content: `<form id="product-form" action="/shop/products/new" method="post" enctype="multipart/form-data" data-disable-on-submit class="space-y-5 px-5 py-6">
      ${error ? errorNotice(error, 'Product could not be added') : ''}
      ${field({
    label: 'Name',
    name: 'name',
    value: values.name,
    placeholder: 'Product name',
    attributes: 'required',
  })}
      ${richEditor({ label: 'Description', value: values.description })}
      ${photoField({ label: 'Product photo' })}
      ${selectCurrency(values.currency)}
      ${field({
    label: 'Price',
    name: 'price',
    value: values.price,
    placeholder: '0.00',
    attributes: 'type="number" inputmode="decimal" step="0.01" min="0.01" max="999.99" required',
  })}
      ${field({
    label: 'Available quantity',
    name: 'available_quantity',
    value: values.available_quantity ?? '1',
    attributes: 'type="number" inputmode="numeric" min="0" max="2147483647" required',
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
