import head from './head.js';

const walletSetupPage = () => `<!doctype html>
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
  <form action='/wallet-setup' method='post'>
    <input
      name='primary_address'
      type='text'
      placeholder='XMR PRIMARY ADDRESS'
      required
   ><br>
    <input
      name='private_view_key'
      type='text'
      placeholder='XMR SECRET VIEW KEY'
      required
   ><br>
    <input
      name='restore_height'
      type='text'
      placeholder='XMR RESTORE BLOCK HEIGHT'
      required
   ><br>

    <button>CREATE</button>
  </form>

  <form action='/'>
    <button>BACK</button>
  </form>
</body>
</html>`;

export default walletSetupPage;
