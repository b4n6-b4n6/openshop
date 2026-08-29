import {
  appFrame,
  button,
  document,
  errorNotice,
  field,
  icon,
} from '../../shared/pages/layout.js';

const IMPORT_TEXT = 'Import a <span class="text-text">view-only</span> Monero wallet. Your spend key never leaves your device.';

const walletSetupPage = ({ error = '' } = {}) => document({
  title: 'Open New Shop',
  body: (
    `<form action="/wallet-setup" method="post" class="contents">
      ${appFrame({
        title: 'Open New Shop',
        titleIcon: icon('wallet', 'size-4'),
        back: '/',
        content: (
          `<div class="space-y-5 px-5 py-6">
            ${error ? errorNotice(error, 'Could not open shop') : ''}
            <p class="text-[14px] text-muted">${IMPORT_TEXT}</p>
            ${field({
              label: 'Monero wallet primary address',
              name: 'primary_address',
              placeholder: '4…',
              mono: true,
              attributes: 'type="text" required autocapitalize="none" autocomplete="off" spellcheck="false"',
            })}
            ${field({
              label: 'Private view key',
              name: 'private_view_key',
              placeholder: 'secret view key',
              mono: true,
              attributes: 'type="text" required autocapitalize="none" autocomplete="off" spellcheck="false"',
            })}
            ${field({
              label: 'Restore block height',
              name: 'restore_height',
              placeholder: 'e.g. 3155600',
              attributes: 'type="text" required inputmode="numeric" pattern="[0-9]+"',
            })}
          </div>`
        ),
        bottom: button({ label: 'Create', type: 'submit' }),
      })}
    </form>`
  ),
});

export default walletSetupPage;
