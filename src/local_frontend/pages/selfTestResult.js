import head from './head.js';
import refresher from './refresher.js';

const selfTestResultPage = ({ result } = {}) => `<!doctype html>
<html>
<head>
  ${head()}
  ${refresher({ interval: 15 })}

  <style>
    body {
      margin: 0;
      overflow: hidden;
      display: flex;
      font-size: 62%;
      height: 100vh;
      vertical-align: middle;
    }
    span {
      margin: auto;
    }
  </style>

</head>
<body>
  <span>
    ${result === true ? '🟢' : ''}
    ${result === false ? '🔴' : ''}
  </span>
</body>
</html>`;

export default selfTestResultPage;
