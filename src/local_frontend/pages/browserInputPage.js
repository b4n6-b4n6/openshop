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
    > <br>

    <button>BROWSE SHOP</button>

    <h2 class='loading-indicator'>LOADING</h2>
  </form>
  <script>
    const form = document.querySelector('form')
    const submitButton = document.querySelector('button')
    const textInput = document.querySelector('[type=text]')

    form.addEventListener('submit', async (event) => {
      submitButton.disabled = true
      textInput.readOnly = true
      form.classList.add('submitting')
      form.submit();
    })
  </script>

  <form action='/'>
    <button>BACK</button>
  </form>

</body>
</html>`;

export default browserInputPage;
