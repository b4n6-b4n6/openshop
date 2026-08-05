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
} from '../../shared/pages/layout.js';
import { escapeAttribute } from '../../shared/utils/html.js';
import indicators from './indicators.js';

const viewProductPage = ({
  id,
  name,
  photo,
  description,
  price,
  currency,
  available_quantity,
  error = '',
}) => {
  const action = `/shop/products/${encodeURIComponent(id)}`;

  return document({
    title: 'Edit Product',
    scripts: ['editor.js', 'owner.js'],
    body: appFrame({
      title: 'Edit Product',
      back: '/shop/products',
      status: indicators(),
      content: `<form id="product-form" action="${escapeAttribute(action)}" method="post" enctype="multipart/form-data" data-disable-on-submit class="space-y-5 px-5 py-6">
        ${error ? errorNotice(error, 'Product could not be updated') : ''}
        ${field({
    label: 'Name',
    name: 'name',
    value: name,
    placeholder: 'Product name',
    attributes: 'required',
  })}
        ${richEditor({ value: description, label: 'Description' })}
        ${photoField({ label: 'Product photo', value: photo })}
        ${selectCurrency(currency)}
        ${field({
    label: 'Price',
    name: 'price',
    value: price,
    placeholder: '0.00',
    attributes: 'type="number" inputmode="decimal" step="0.01" min="0.01" max="999.99" required',
  })}
        ${field({
    label: 'Available quantity',
    name: 'available_quantity',
    value: available_quantity,
    attributes: 'type="number" inputmode="numeric" min="0" max="2147483647" required',
  })}
      </form>`,
      bottom: button({
        label: 'Update',
        type: 'submit',
        attributes: 'form="product-form"',
      }),
    }),
  });
};

export default viewProductPage;
