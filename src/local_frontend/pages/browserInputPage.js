import head from './head.js';

const browserInputPage = ({ defaultOnionHostname }) => `<!doctype html>
<html>
<head>
  ${head()}

  <style>
    button, input {
      font-size: 250%;
    }
    
    form:not(.submitting) .loading-indicator {
      display: none;
    }
  </style>
</head>
<body>
  <form action='/browser-input' method='post'>
    <input
      name='browsed_onion_address'
      type='text'
      placeholder='SHOP ADDRESS'
      value=${defaultOnionHostname}
      required
    /> <br />

    <button>BROWSE SHOP</button>

    <h2 class='loading-indicator'>LOADING</h2>
  </form>

  <form action='/'>
    <button>BACK</button>
  </form>

  <script>
    const form = document.querySelector('form')
    const submitButton = document.querySelector('button')
    const textInput = document.querySelector('[type=text]')

    const resetForm = () => {
      submitButton.disabled = false
      textInput.disabled = false
      form.classList.remove('submitting')
    }

    const lockForm = () => {
      submitButton.disabled = true
      textInput.disabled = true
      form.classList.add('submitting')
    }

    form.addEventListener('submit', async (event) => {
      const body = new URLSearchParams(new FormData(form));

      event.preventDefault()

      lockForm()
      const res = await fetch('/browser-input', {
        method: 'POST',
        body,
      });
      
      if (res.ok) {
        window.location.href = '/browser/';
      } else {
        alert('invalid address format')
        resetForm()
      }
    })
  </script>
</body>
</html>`;

export default browserInputPage;
