import head from './head.js';
import formatUserId from '../../utils/formatUserId.js';
import formatDate from '../../utils/formatDate.js';
import indicators from './indicators.js';
import refresher from './refresher.js';

const viewConvosPage = ({
  allConvos,
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
      align-self: flex-start;
    }

    pre {
      margin: 0;
      padding: 0.25em;
      background: #eee;
    }
  </style>
</head>
<body>
  ${indicators()}

  <ul>
    ${allConvos.map(({
    id, last_message_at, last_message_sender, unread,
  }) => (
    `<li>
      <pre><a href='/shop/convos/${id}'>${formatUserId(id)}</a></pre>
      <small title='${last_message_at}'>${formatDate(last_message_at)}</small>
      ${
    (id === last_message_sender ? unread : false)
      ? ' <span title="UNREAD">🟠</span>'
      : ''
    }

      <form action='/shop/convos/${id}'><button>OPEN</button></form>
    </li>`
  )).join('')}
  </ul>
  ${!allConvos.length ? 'nothing' : ''}

  <hr>

  <form action='/shop'><button>BACK</button></form>
</body>
</html>`;

export default viewConvosPage;
