import { IMG_SRC_PLACEHOLDER } from '../../const.js';
import bufferToDataURI from '../../utils/bufferToDataURI.js';
import head from './head.js';

const productsPage = ({
  allProducts,
}) => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    input[type='file'] {
      display: none
    }
  </style>
</head>
<body>
  ${allProducts.map(({
    id, name, photo, price, currency, available_quantity,
  }) => (
    `<form action='/browser/shop/products/${id}' method='GET'>
  <input
    type='text'
    readonly
    value='${name}'
  >
  <br>

  <img
    class='change-product-photo-preview'
    alt='product photo'
    src="${photo ? bufferToDataURI('unknown', photo) : IMG_SRC_PLACEHOLDER}"
  >
  <br>

  <label>
    PRICE: 
    <input
      type='number'
      readonly
      value='${price}'
    >
    <input
      type='text'
      readonly
      value='${currency}'
    >
  </label><br>

  <label>
    AVAILABLE QUANTITY: 
    <input
      type='number'
      readonly
      value='${available_quantity}'
    >
  </label><br>

  <button>PURCHASE</button>
</form>`
  )).join('<hr>')}

  <hr>

  <form action='/browser/'><button>BACK</button></form>
</body>
</html>`;

export default productsPage;
