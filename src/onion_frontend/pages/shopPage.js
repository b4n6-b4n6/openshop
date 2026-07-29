import head from './head.js';
import bufferToDataURI from '../../utils/bufferToDataURI.js';

const shopPage = ({
  enableBackButton,
  address,
  name,
  description,
  profile_photo,
  banner_photo,
}) => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    button {
      font-size: 150%;
    }

    input[name='address'] {
      width: 40em;
      text-align: center;
      font-family: monospace;
      font-size: 1em;
    }

    img {
      border: 1px dotted black;
    }

    .enlarged {
      transform: scale(1200%);
    }
  </style>
</head>
<body>
  <input name='address' type='text' readonly value='${address}'/>
  <br>

  <button class='qr-button'>▣</button>
  <br>
  <script>
    document
      .querySelector('.qr-button')
      .addEventListener('click', (event) => {
        event.target.classList.toggle('enlarged')
      })
  </script>

  <img alt='profile photo' src="${profile_photo && bufferToDataURI('unknown', profile_photo)}">
  <br>

  <img alt='banner photo' src="${banner_photo && bufferToDataURI('unknown', banner_photo)}">
  <br>

  <input type='text' readonly placeholder='Shop name' value='${name}'>
  <br>

  <textarea readonly placeholder='Shop description'>${description}</textarea>

  <form action='./products'><button>PRODUCTS</button></form>
  <form action='./chats'><button>CHAT</button></form>
  <form action='./orders'><button>ORDERS</button></form>

  <hr>

  ${
  enableBackButton ? (
    '<form action=\'/browser-input\'><button>BACK</button></form>'
  ) : ''
}
</body>
</html>`;

export default shopPage;
