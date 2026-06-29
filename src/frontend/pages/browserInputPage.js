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
  <form action="/browser">
    <input
      name="address"
      type="text"
      placeholder="SHOP ADDRESS"
      required
    /> <br />
    <button>BROWSE SHOP</button>
  </form>

  <button onclick="history.back()">BACK</button>
</body>
</html>`;

export default browserInputPage;
