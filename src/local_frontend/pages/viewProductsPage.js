import { IMG_SRC_PLACEHOLDER } from '../../const.js';
import bufferToDataURI from '../../utils/bufferToDataURI.js';
import head from './head.js';
import indicators from './indicators.js';

const viewProductsPage = ({
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
  ${indicators()}

  ${allProducts.map(({
    id, name, photo, price, currency, available_quantity,
  }) => (
    `<form action='/shop/products/${id}' method='GET'>
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

  <button>EDIT</button>
</form>`
  )).join('<hr>')}

  <hr>

  <form action='/shop'><button>BACK</button></form>
</body>
</html>`;

export default viewProductsPage;
