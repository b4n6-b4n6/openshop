import head from './head.js';
import refresher from './refresher.js';

const onionSpinnerProgressPage = ({ progress }) => `<!doctype html>
<html>
<head>
  ${head()}
  ${progress !== 100 ? refresher() : ''}
  ${progress === 100 ? refresher({ url: '/my-shop' }) : ''}

  <style>
    button {
      font-size: 250%;
    }
  </style>
</head>
<body>
  <pre><h1>SPINNING UP ONION
${progress}%...</h1></pre>
</body>
</html>`;

export default onionSpinnerProgressPage;
