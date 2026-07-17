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
      currency: 'usd',
      price: '1.50',
      available_quantity: 25,
    },
    {
      id: cookieId,
      name: 'cookie',
      currency: 'usd',
      price: '1.00',
      available_quantity: 20,
    },
  ]);

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
      currency: 'usd',
      price: '1.50',
      available_quantity: 25,
    },
    {
      id: cookieId,
      name: 'cookies',
      currency: 'eur',
      price: '2.00',
      available_quantity: 10,
    },
  ]);

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
      photo: Buffer.from('12341234', 'hex'),
      currency: 'usd',
      price: '1.50',
      available_quantity: 25,
    },
    {
      id: cookieId,
      name: 'cookie',
      photo: Buffer.from('22222222', 'hex'),
      currency: 'usd',
      price: '1.00',
      available_quantity: 15,
    },
    {
      id: hashbrownId,
      name: 'hashbrown',
      photo: Buffer.from('33333333', 'hex'),
      currency: 'usd',
      price: '1.60',
      available_quantity: 100,
    },
  ]);

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
    id: cookieId,
    name: 'cookie',
    description: 'extra crunchy!',
    currency: 'usd',
    price: '1.00',
    available_quantity: 20,
  });

  await products.destroy();
});
