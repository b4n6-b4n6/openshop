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
  <form action='/browser-input'>
    <input
      name='onion'
      type='text'
      placeholder='SHOP ADDRESS'
      required
    /> <br />
    <button>BROWSE SHOP</button>
  </form>
  <script>
    const form = document.querySelector('form')

    form.onsubmit = (event) => {
      event.preventDefault()

      const onion = document.querySelector('[name=onion]').value
      if (!onion) { return }

      ;(async () => {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new URLSearchParams({ onion })
        })

        if (res.ok) {
          location.href = '/browser/'
        }
      })()
    }
  </script>

  <form action='/'>
    <button>BACK</button>
  </form>
</body>
</html>`;

export default browserInputPage;
