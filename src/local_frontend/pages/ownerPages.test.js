import { jest } from '@jest/globals';
import editShopPage from './editShopPage.js';
import newProductPage from './newProductPage.js';
import newProductPost from '../routes/newProductPost.js';
import onionErrorPage from './onionErrorPage.js';
import validateProductInput from '../utils/validateProductInput.js';
import syncStatusResult from './syncStatusResult.js';
import viewConvosPage from './viewConvosPage.js';
import viewProductPage from './viewProductPage.js';
import viewProductsPage from './viewProductsPage.js';
import viewShopPage from './viewShopPage.js';

const shop = {
  address: 'exampleexampleexample.onion',
  banner_photo: null,
  description: '[b]Private[/b] shop',
  name: 'My shop',
  profile_photo: null,
  qr: 'data:image/png;base64,AAAA',
};

const product = {
  available_quantity: 3,
  currency: 'usd',
  description: '[i]Description[/i]',
  id: 'product-1',
  name: 'Product',
  photo: null,
  price: '12.50',
};

test('all owner screens include the live wallet sync indicator', () => {
  const pages = [
    viewShopPage(shop),
    editShopPage(shop),
    newProductPage(),
    viewProductsPage({ allProducts: [product] }),
    viewProductPage(product),
    viewConvosPage({ allConvos: [] }),
  ];

  pages.forEach((page) => {
    expect(page).toContain('src="/sync-status"');
    expect(page).toContain('allowtransparency="true"');
    expect(page).not.toContain('src="/self-test"');
  });
});

test('shop screen renders owner actions and an interactive QR code', () => {
  const page = viewShopPage(shop);

  expect(page).toContain('href="/shop/settings"');
  expect(page).toContain('href="/shop/products/new"');
  expect(page).toContain('href="/shop/products"');
  expect(page).toContain('href="/shop/orders"');
  expect(page).toContain('href="/shop/convos"');
  expect(page).toContain('data-qr-open');
  expect(page).toContain('data-qr-save');
  expect(page).toContain('data-qr-modal');
  expect(page).toContain('data-qr-logo');
});

test('edit shop keeps details and photo upload contracts', () => {
  const page = editShopPage(shop);

  expect(page).toContain('action="/shop/settings" method="post"');
  expect(page).toContain('name="name"');
  expect(page).toContain('name="description"');
  expect(page).toContain('action="/shop/settings/profile-photo"');
  expect(page).toContain('action="/shop/settings/banner-photo"');
  expect(page).toContain('enctype="multipart/form-data"');
});

test('product forms preserve backend field names', () => {
  const pages = [newProductPage(), viewProductPage(product)];

  pages.forEach((page) => {
    expect(page).toContain('name="name"');
    expect(page).toContain('name="description"');
    expect(page).toContain('name="photo"');
    expect(page).toContain('name="currency"');
    expect(page).toContain('name="price"');
    expect(page).toContain('name="available_quantity"');
    expect(page).toContain('enctype="multipart/form-data"');
  });
  expect(pages[0]).toContain('action="/shop/products/new"');
  expect(pages[1]).toContain('action="/shop/products/product-1"');
});

test('new products return to the product list after creation', async () => {
  const create = jest.fn().mockResolvedValue('product-1');
  const ctx = {
    backend: { products: { create } },
    request: {
      body: {
        available_quantity: '1',
        currency: 'usd',
        description: '',
        name: 'New product',
        price: '2.50',
      },
      files: { photo: [] },
    },
    redirect: jest.fn(),
  };

  await newProductPost(ctx);

  expect(create).toHaveBeenCalledTimes(1);
  expect(ctx.redirect).toHaveBeenCalledWith('/shop/products');
});

test('product prices are bounded before PostgreSQL receives them', async () => {
  const create = jest.fn();
  const ctx = {
    backend: { products: { create } },
    request: {
      body: {
        available_quantity: '1',
        currency: 'usd',
        description: '',
        name: 'Too expensive',
        price: '1000',
      },
      files: { photo: [] },
    },
  };

  await newProductPost(ctx);

  expect(validateProductInput({ price: '999.99', available_quantity: '1' })).toBeNull();
  expect(validateProductInput({ price: '1000', available_quantity: '1' })).toContain('999.99');
  expect(ctx.status).toBe(400);
  expect(ctx.body).toContain('Price must be greater than 0 and no more than 999.99.');
  expect(create).not.toHaveBeenCalled();
});

test('owner pages escape database content', () => {
  const payload = '<script>alert(1)</script>"';
  const page = viewShopPage({
    ...shop,
    address: payload,
    description: payload,
    name: payload,
  });

  expect(page).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  expect(page).not.toContain('<script>alert(1)</script>');
});

test('product list and chats render empty and populated states', () => {
  expect(viewProductsPage({ allProducts: [] })).toContain('No products yet');
  expect(viewProductsPage({ allProducts: [product] })).toContain('12.50');

  const chats = viewConvosPage({
    allConvos: [{
      id: 'buyer-123',
      last_message_at: new Date(),
      last_message_sender: 'buyer-123',
      unread: true,
    }],
  });
  expect(chats).toContain('href="/shop/convos/buyer-123"');
  expect(chats).toContain('aria-label="Unread messages"');
  expect(viewConvosPage({ allConvos: [] })).toContain('No chats yet');
});

test('wallet status reports waiting, syncing, and synchronized states', () => {
  expect(syncStatusResult()).toContain('Wallet');
  expect(syncStatusResult({ height: 100, percent: 42.4 })).toContain('42%');
  expect(syncStatusResult({ height: 200, percent: 100 })).toContain('Synced');
});

test('onion startup failures are reported in the frontend', () => {
  const page = onionErrorPage({ message: 'hostname missing' });

  expect(page).toContain('SHOP UNAVAILABLE');
  expect(page).toContain('hostname missing');
  expect(page).toContain('href="/onion-spinner"');
  expect(page).not.toContain('<script>alert');
});
