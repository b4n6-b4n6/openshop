import head from './head.js';

const browserInputPage = () => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    button, input {
      font-size: 250%;
    }
  </style>
</head>
<body>
  <form action='/browser-input' method='post'>
    <input
      name='onion'
      type='text'
      placeholder='SHOP ADDRESS'
      required
    /> <br />

    <button>BROWSE SHOP</button>
  </form>

  <form action='/'>
    <button>BACK</button>
  </form>
</body>
</html>`;

export default browserInputPage;
