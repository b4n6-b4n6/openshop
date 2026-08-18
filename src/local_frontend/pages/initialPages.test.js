import rootPage from './rootPage.js';
import browserErrorPage from './browserErrorPage.js';
import browserInputPage from './browserInputPage.js';
import onionSpinnerProgressPage from './onionSpinnerProgressPage.js';
import walletSetupPage from './walletSetupPage.js';
import walletSetupProgressPage from './walletSetupProgressPage.js';

test('initial page links to both approved flows', () => {
  const page = rootPage();

  expect(page).toContain('Open New Shop');
  expect(page).toContain('href="/wallet-setup"');
  expect(page).toContain('Browse Shop');
  expect(page).toContain('href="/browser-input"');
  expect(page).toContain('/static/app.css');
});

test('browse page preserves and escapes its onion value', () => {
  const page = browserInputPage({
    defaultOnionHostname: '"><script>alert(1)</script>',
  });

  expect(page).toContain('name="browsed_onion_address"');
  expect(page).toContain('&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;');
  expect(page).not.toContain('<script>alert(1)</script>');
  expect(page).toContain('data-scan-qr');
  expect(page).toContain('/static/jsqr.js');
  expect(page.indexOf('/static/jsqr.js')).toBeLessThan(page.indexOf('/static/browse.js'));
  expect(page).toContain('browse-loading h-full flex-col items-center justify-center gap-6');
});

test('wallet page keeps the backend field contract and reports errors', () => {
  const page = walletSetupPage({ error: 'invalid <key>' });

  expect(page).toContain('name="primary_address"');
  expect(page).toContain('name="private_view_key"');
  expect(page).toContain('name="restore_height"');
  expect(page).toContain('invalid &lt;key&gt;');
});

test('progress pages refresh without adding frontend routes', () => {
  expect(walletSetupProgressPage()).toContain(
    '<meta http-equiv="refresh" content="2">',
  );
  expect(onionSpinnerProgressPage({ progress: 50 })).toContain('50%');
  expect(onionSpinnerProgressPage({ progress: 100 })).toContain(
    '<meta http-equiv="refresh" content="0; URL=/shop">',
  );
});

test('browse errors are escaped before rendering', () => {
  const page = browserErrorPage({ message: '<script>bad()</script>' });

  expect(page).toContain('&lt;script&gt;bad()&lt;/script&gt;');
  expect(page).not.toContain('<script>bad()</script>');
});

test('local pages include the EULA modal and script', () => {
  const page = rootPage();

  expect(page).toContain('id="eulaOverlay"');
  expect(page).toContain('id="eulaCheckbox"');
  expect(page).toContain('id="btnAcceptEula"');
  expect(page).toContain('I will only use this software for legal purposes');
  expect(page).toContain('/static/eula.js');
  expect(page).toContain('openshop_eula_accepted');
});
