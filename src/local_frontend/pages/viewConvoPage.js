/* eslint-disable no-constant-binary-expression */
import { IMG_SRC_PLACEHOLDER } from '../../const.js';
import bufferToDataURI from '../../utils/bufferToDataURI.js';
import formatDate from '../../utils/formatDate.js';
import formatUserId from '../../utils/formatUserId.js';
import head from './head.js';
import refresher from './refresher.js';
import indicators from './indicators.js';

const orderStatusUpdateBubble = ({
  id,
  type,
  occured_at,
  product_name, product_photo,
  purchase_price, purchase_currency, purchase_quantity,
}) => (
  `<li class='order-status-update'>
    <form action='/shop/orders/${id}' method='GET'>
      <input type='text' readOnly value='${type}'>
      <br>

      <input type='text' readOnly value='${product_name}'>
      <br>

      <img
        class='change-product-photo-preview'
        alt='product photo'
        src="${product_photo ? bufferToDataURI('unknown', product_photo) : IMG_SRC_PLACEHOLDER}"
      >
      <br>

      Purchase price ${purchase_price} ${purchase_currency}
      <br>

      Purchase quantity ${purchase_quantity}
      <br>

      Created <small title='${occured_at}'>${formatDate(occured_at)}</small>
      <br>

      <button>VIEW</button>
    </form>
  </li>`
);

const convoMessageBubble = ({
  id,
  text_content,
  created_at, received_at, read_at,
  isMine,
}) => (
  `<li class='convo-message ${isMine ? 'mine' : ''}'>
    ${text_content ? `<label>${text_content}</label>` : ''}
    ${!text_content
    ? `<label>Image (<a href="/shop/convos/images/${id}">download</a>)</label>`
    : ''}
    <br>

    <small title='${created_at}'>${formatDate(created_at)}</small>
    ${(isMine
    ? (
      `<span class='float-right'>
        ${(false
        || (read_at && '✔✔')
        || (received_at && '✔')
        || '')}
      </span>`
    ) : '')}
  </li>`
);

const viewConvoPage = ({
  allExtMessages,
  userId,
}) => `<!doctype html>
<html>
<head>
  ${head()}
  ${refresher({ interval: 10 })}

  <style>
    input[type='file'] {
      display: none
    }

    ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    
    li {
      background: #ccc;
      margin: 0.5em;
      padding: 0.5em;
      border-radius: 0.5em;
    }

    li.convo-message.mine {
      align-self: flex-end;
    }

    li.convo-message:not(.mine) {
      align-self: flex-start;
    }

    .order-status-update {
      align-self: flex-start;
    }

    .float-right {
      float: right;
    }
  </style>
</head>
<body>
  ${indicators()}

  <input readOnly value='${formatUserId(userId)}' />
  <ul>
      ${allExtMessages.map(({
    id,
    ext_message_occured_at,
    ext_message_type,
    ext_message_payload,
  }) => (
    ext_message_type === 'CONVO' ? convoMessageBubble({
      id,
      ...ext_message_payload,
      isMine: userId !== ext_message_payload.sender,
    })
      : orderStatusUpdateBubble({
        id,
        occured_at: ext_message_occured_at,
        type: ext_message_type,
        ...ext_message_payload,
      })
  )).join('')}
  </ul>
  ${!allExtMessages.length ? 'nothing' : ''}

  <hr>

  <form action='/shop/convos/${userId}' method='POST' enctype='multipart/form-data'>
    <button type='button'>SEND IMAGE</button>

    <input name='image' type='file'>
  </form>
  <script>
    implementImageUpload = (selectorQuery) => {
      const form = document.querySelector(selectorQuery)
      const fileInput = form.querySelector('input[type=file]')
      const changeButton = form.querySelector('button')

      fileInput.addEventListener('change', (event) => {
        const files = event.target.files

        if (files.length) {
          changeButton.disabled = true
          form.submit()
        }
      })
      changeButton.addEventListener('click', (event) => {
        fileInput.click()
      })
    }

    implementImageUpload('[method="POST"]')
  </script>

  <form action='/shop/convos/${userId}' method='POST'>
    <textarea
      name='text'
      placeholder='TEXT MESSAGE'
    ></textarea>
    <br>

    <button>SEND TEXT</button>
  </form>

  <hr>

  <form action='/shop/convos'><button>BACK</button></form>
</body>
</html>`;

export default viewConvoPage;
