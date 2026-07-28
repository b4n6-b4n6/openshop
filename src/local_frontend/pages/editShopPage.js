import head from './head.js';

const editShopPage = ({
  name,
  description,
}) => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    button {
      font-size: 150%;
    }

    [src='/self-test'] {
      width: 1em;
      height: 1em;
      border: 1px solid black;
    }

    [src='/sync-status'] {
      width: 6em;
      height: 1em;
      border: 1px solid black;
    }

    input[type='file'] {
      display: none;
    }
  </style>
</head>
<body>
  <form action='/shop/settings' method='post'>
    <input
      type='text'
      name='name'
      placeholder='Shop name'
      value='${name}'
    >
    <br>

    <textarea
      name='description'
      placeholder='Shop description'
    >${description}</textarea>
    <hr>

    <button>UPDATE</button>
  </form>

  <form action='/shop'><button>BACK</button></form>
</body>
</html>`;

export default editShopPage;
