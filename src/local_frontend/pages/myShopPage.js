import head from './head.js';

const myShopPage = ({ onion }) => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    button {
      font-size: 250%;
    }
  </style>
</head>
<body>
  <pre>${onion}</pre>
</body>
</html>`;

export default myShopPage;
