import { qrView } from './components.js';

test('QR view keeps branding, enlargement, and PNG download controls', () => {
  const html = qrView({
    qr: 'data:image/png;base64,iVBORw0KGgo=',
    caption: 'shop.onion',
    fileName: 'shop-qr.png',
    size: 64,
    basePath: '/browser',
  });

  expect(html).toContain('data-qr-open');
  expect(html).toContain('data-qr-modal');
  expect(html).toMatch(/data-qr-modal[^>]+hidden/);
  expect(html).toContain('data-qr-save');
  expect(html).toContain('data-file-name="shop-qr.png"');
  expect(html).toContain('/browser/static/images/logo-orange.svg');
  expect(html).toContain('shop.onion');
});
