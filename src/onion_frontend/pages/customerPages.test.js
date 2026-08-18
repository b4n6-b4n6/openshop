import productPage from './productPage.js';
import productsPage from './productsPage.js';
import shopPage from './shopPage.js';

const shop = {
  address: 'exampleexampleexample.onion',
  banner_photo: null,
  description: '[b]Private[/b] shop',
  enableBackButton: true,
  name: 'Night market',
  profile_photo: null,
  qr: 'data:image/png;base64,AAAA',
};

const product = {
  available_quantity: 4,
  currency: 'usd',
  description: '[i]Handmade[/i]',
  id: 'product-1',
  name: 'Product',
  photo: null,
  price: '12.50',
};

test('customer shop renders its media, actions, QR, and back navigation', () => {
  const page = shopPage(shop);

  expect(page).toContain('/static/app.css');
  expect(page).toContain('href="/browser-input"');
  expect(page).toContain('href="/browser/products"');
  expect(page).toContain('href="/browser/convo"');
  expect(page).toContain('href="/browser/orders"');
  expect(page).toContain('data-qr-open');
  expect(page).toContain('data-qr-save');
  expect(page).toContain('<strong>Private</strong> shop');
  expect(page).toContain('/static/copy.js');
});

test('customer shop hides local-only back navigation for direct visitors', () => {
  const page = shopPage({ ...shop, enableBackButton: false });

  expect(page).not.toContain('href="/browser-input"');
  expect(page).not.toContain('/sync-status');
});

test('customer shop escapes database content', () => {
  const payload = '<script>alert(1)</script>"';
  const page = shopPage({
    ...shop,
    address: payload,
    description: payload,
    name: payload,
  });

  expect(page).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  expect(page).not.toContain('<script>alert(1)</script>');
});

test('customer product list handles available, unavailable, and empty states', () => {
  const page = productsPage({
    allProducts: [product, { ...product, id: 'product-2', available_quantity: 0 }],
  });

  expect(page).toContain('href="/browser/products/product-1"');
  expect(page).toContain('Purchase');
  expect(page).toContain('Out of stock');
  expect(page).toContain('disabled aria-label="Out of stock"');
  expect(productsPage({ allProducts: [] })).toContain('No products');
});

test('purchase screen preserves form contracts and rich product content', () => {
  const page = productPage({
    ...product,
    photo: 'data:image/png;base64,AAAA',
  });

  expect(page).toContain('action="/browser/products/product-1"');
  expect(page).toContain('name="purchase_quantity"');
  expect(page).toContain('min="1" max="4"');
  expect(page).toContain('Purchase · $12.50');
  expect(page).toContain('<em>Handmade</em>');
  expect(page).toContain('product-photo-full');
  expect(page).toContain('src="data:image/png;base64,AAAA"');
  expect(page).toContain('/static/customer.js');
});

test('onion pages include the EULA modal and script', () => {
  const page = shopPage(shop);

  expect(page).toContain('id="eulaOverlay"');
  expect(page).toContain('id="eulaCheckbox"');
  expect(page).toContain('id="btnAcceptEula"');
  expect(page).toContain('I will only use this software for legal purposes');
  expect(page).toContain('/static/eula.js');
  expect(page).toContain('openshop_eula_accepted');
});
