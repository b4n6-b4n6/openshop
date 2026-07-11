import head from './head.js';

const browserErrorPage = ({ message }) => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    button {
      font-size: 250%;
    }
    pre {
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <pre>ERROR - ${message}</pre>

  <form action='/browser-input'>
    <button>BACK</button>
  </form>
</body>
</html>`;

export default browserErrorPage;
