import { randomUUID } from 'node:crypto';
import createProducts from './index.js';

test('can get a non-existent product', async () => {
  const products = await createProducts();

  expect(await products.get(randomUUID())).toEqual(undefined);

  await products.destroy();
});

test('can get empty array of products', async () => {
  const products = await createProducts();

  expect(await products.getAll()).toEqual([]);

  await products.destroy();
});

test('can create a product', async () => {
  const products = await createProducts();

  const brownieId = await products.create({
    name: 'brownie',
    description: 'coco!',
    currency: 'usd',
    price: '1.50',
    available_quantity: 25,
  });
  const cookieId = await products.create({
    name: 'cookie',
    description: 'crunchy!',
    currency: 'usd',
    price: '1.00',
    available_quantity: 20,
  });

  expect(await products.getAll()).toMatchObject([
    {
      id: brownieId,
      name: 'brownie',
      photo_exists: false,
      currency: 'usd',
      price: '1.50',
      available_quantity: 25,
    },
    {
      id: cookieId,
      name: 'cookie',
      photo_exists: false,
      currency: 'usd',
      price: '1.00',
      available_quantity: 20,
    },
  ]);

  await products.destroy();
});

test('cannot create a product with negative price', async () => {
  const products = await createProducts();

  await expect(products.create({
    name: 'brownie',
    description: 'coco!',
    currency: 'usd',
    price: '-1.50',
    available_quantity: 25,
  })).rejects.toThrow('new row for relation "products" violates check constraint "products_price_check"');

  await products.destroy();
});

test('cannot create a product with zero price', async () => {
  const products = await createProducts();

  await expect(products.create({
    name: 'brownie',
    description: 'coco!',
    currency: 'usd',
    price: '0',
    available_quantity: 25,
  })).rejects.toThrow('new row for relation "products" violates check constraint "products_price_check"');

  await products.destroy();
});

test('cannot create a product with no currency', async () => {
  const products = await createProducts();

  await expect(products.create({
    name: 'brownie',
    description: 'coco!',
    currency: '',
    price: '1.50',
    available_quantity: 25,
  })).rejects.toThrow('new row for relation "products" violates check constraint "products_currency_check"');

  await products.destroy();
});

test('can update a product: name, currency, price, available_quantity', async () => {
  const products = await createProducts();

  const brownieId = await products.create({
    name: 'brownie',
    description: 'coco!',
    currency: 'usd',
    price: '1.50',
    available_quantity: 25,
  });
  const cookieId = await products.create({
    name: 'cookie',
    description: 'crunchy!',
    currency: 'usd',
    price: '1.00',
    available_quantity: 20,
  });

  await products.update({
    id: cookieId,
    name: 'cookies',
    description: 'crunchy!!!',
    currency: 'eur',
    price: '2.00',
    available_quantity: 10,
  });

  expect(await products.getAll()).toMatchObject([
    {
      id: brownieId,
      name: 'brownie',
      photo_exists: false,
      currency: 'usd',
      price: '1.50',
      available_quantity: 25,
    },
    {
      id: cookieId,
      name: 'cookies',
      photo_exists: false,
      currency: 'eur',
      price: '2.00',
      available_quantity: 10,
    },
  ]);
  expect(await products.get(cookieId)).toMatchObject({
    name: 'cookies',
    photo: null,
    description: 'crunchy!!!',
    currency: 'eur',
    price: '2.00',
    available_quantity: 10,
  });

  await products.destroy();
});

test('can update a product: photo', async () => {
  const products = await createProducts();

  const brownieId = await products.create({
    name: 'brownie',
    photo: Buffer.from('11111111', 'hex'),
    description: 'coco!',
    currency: 'usd',
    price: '1.50',
    available_quantity: 25,
  });
  const cookieId = await products.create({
    name: 'cookie',
    photo: Buffer.from('22222222', 'hex'),
    description: 'crunchy!',
    currency: 'usd',
    price: '1.00',
    available_quantity: 20,
  });
  const hashbrownId = await products.create({
    name: 'hashbrown',
    photo: Buffer.from('33333333', 'hex'),
    description: 'creamy!',
    currency: 'usd',
    price: '1.60',
    available_quantity: 100,
  });

  await products.update({
    id: brownieId,
    name: 'brownie',
    photo: Buffer.from('12341234', 'hex'),
    description: 'coco!',
    currency: 'usd',
    price: '1.50',
    available_quantity: 25,
  });
  await products.update({
    id: cookieId,
    name: 'cookie',
    description: 'crunchy!',
    currency: 'usd',
    price: '1.00',
    available_quantity: 15,
  });

  expect(await products.getAll()).toMatchObject([
    {
      id: brownieId,
      name: 'brownie',
      photo_exists: true,
      currency: 'usd',
      price: '1.50',
      available_quantity: 25,
    },
    {
      id: cookieId,
      name: 'cookie',
      photo_exists: true,
      currency: 'usd',
      price: '1.00',
      available_quantity: 15,
    },
    {
      id: hashbrownId,
      name: 'hashbrown',
      photo_exists: true,
      currency: 'usd',
      price: '1.60',
      available_quantity: 100,
    },
  ]);

  expect(await products.getPhoto(brownieId)).toEqual(Buffer.from('12341234', 'hex'));
  expect(await products.getPhoto(cookieId)).toEqual(Buffer.from('22222222', 'hex'));
  expect(await products.getPhoto(hashbrownId)).toEqual(Buffer.from('33333333', 'hex'));

  expect((await products.get(brownieId)).photo).toEqual(Buffer.from('12341234', 'hex'));
  expect((await products.get(cookieId)).photo).toEqual(Buffer.from('22222222', 'hex'));
  expect((await products.get(hashbrownId)).photo).toEqual(Buffer.from('33333333', 'hex'));

  await products.destroy();
});

test('can update a product: description', async () => {
  const products = await createProducts();

  const cookieId = await products.create({
    name: 'cookie',
    description: 'crunchy!',
    currency: 'usd',
    price: '1.00',
    available_quantity: 20,
  });

  await products.update({
    id: cookieId,
    name: 'cookie',
    description: 'extra crunchy!',
    currency: 'usd',
    price: '1.00',
    available_quantity: 20,
  });

  expect(await products.get(cookieId)).toMatchObject({
    name: 'cookie',
    description: 'extra crunchy!',
    currency: 'usd',
    price: '1.00',
    available_quantity: 20,
  });

  await products.destroy();
});
