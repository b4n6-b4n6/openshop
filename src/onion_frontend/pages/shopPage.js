import head from './head.js';

const shopPage = ({ enableBackButton, onion }) => `<!doctype html>
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

  ${
  enableBackButton ? (
    `<form action='/browser-input'>
        <button>BACK</button>
      </form>`
  ) : ''
}
</body>
</html>`;

export default shopPage;
