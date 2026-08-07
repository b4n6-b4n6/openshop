import head from './head.js';
import formatDate from '../../utils/formatDate.js';
import refresher from './refresher.js';

const convoPage = ({
  allMessages,
  userId,
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
    }

    li.mine {
      align-self: flex-end;
    }

    li:not(.mine) {
      align-self: flex-start;
    }
  </style>
</head>
<body>
  <ul>
    ${allMessages.map(({
    id, sender, text_content, created_at, read_at,
  }) => (
    `<li class='${userId === sender ? 'mine' : ''}'>
      ${text_content ? `<label>${text_content}</label>` : ''}
      ${!text_content
      ? `<label>Image (<a href="/browser/convo/images/${id}">download</a>)</label>`
      : ''}
      <br>

      <small title='${created_at}'>${formatDate(created_at)}</small>
      ${(userId !== sender && read_at
      ? '<span class=\'float-right\'>✔✔</span>'
      : '')}
    </li>`
  )).join('')}
  </ul>
  ${!allMessages.length ? 'nothing' : ''}

  <hr>


  <form action='/browser/convo' method='POST' enctype='multipart/form-data'>
    <button type='button'>SEND IMAGE</button>

    <input name='image' type='file'>
  </form>
  <script>
    implementImageUpload = (selectorQuery) => {
      const form = document.querySelector(selectorQuery)
      const fileInput = form.querySelector('input[type=file]')
      const changeButton = form.querySelector('button')

      fileInput.addEventListener('change', (event) => {
        const files = event.target.files

        if (files.length) {
          changeButton.disabled = true
          form.submit()
        }
      })
      changeButton.addEventListener('click', (event) => {
        fileInput.click()
      })
    }

    implementImageUpload('[action="/browser/convo"]')
  </script>

  <form action='/browser/convo' method='POST'>
    <textarea
      name='text'
      placeholder='TEXT MESSAGE'
    ></textarea>
    <br>

    <button>SEND TEXT</button>
  </form>

  <hr>

  <form action='/browser/'><button>BACK</button></form>
</body>
</html>`;

export default convoPage;
