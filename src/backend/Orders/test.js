import { randomUUID } from 'node:crypto';
import timers from 'node:timers/promises';
import createOrders from './index.js';

const CUSTOMER = '370c6cbe-8a6c-4d77-8070-bc21c32fc904';

test('can get a non-existent order', async () => {
  const orders = await createOrders();

  expect(
    await orders.get(randomUUID()),
  ).toEqual(undefined);

  await orders.destroy();
});

test('can create an order', async () => {
  const orders = await createOrders();

  const id = await orders.create({
    customer: CUSTOMER,

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  });

  const order = await orders.get(id);
  expect(order).toMatchObject({
    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  });
  expect(order.created_at).toBeTruthy();

  await orders.destroy();
});

test('errors on 2 orders with identical deposit amount', async () => {
  const orders = await createOrders();

  const id = await orders.create({
    customer: CUSTOMER,

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  });
  const order = await orders.get(id);
  expect(order).toMatchObject({
    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  });
  expect(order.created_at).toBeTruthy();

  await expect(orders.create({
    customer: CUSTOMER,

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  })).rejects.toThrow('duplicate key value violates unique constraint "orders_deposit_amount_idx"');

  await orders.destroy();
});

test('can create an order and get all for shop', async () => {
  const orders = await createOrders();

  await orders.create({
    customer: CUSTOMER,

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  });
  await timers.setTimeout(25);
  await orders.create({
    customer: CUSTOMER,

    product_name: 'cookie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '0.60',
    purchase_quantity: 500,

    deposit_amount: 5000000000000,
  });

  const allOrders = await orders.getAllForShop();
  expect(allOrders).toMatchObject([
    {
      customer: CUSTOMER,

      product_name: 'cookie',

      purchase_currency: 'usd',
      purchase_price: '0.60',
      purchase_quantity: 500,
    },
    {
      customer: CUSTOMER,

      product_name: 'brownie',

      purchase_currency: 'usd',
      purchase_price: '1.50',
      purchase_quantity: 200,
    },
  ]);
  expect(allOrders[0].id).toBeTruthy();
  expect(allOrders[0].created_at).toBeTruthy();
  expect(allOrders[1].id).toBeTruthy();
  expect(allOrders[1].created_at).toBeTruthy();

  await orders.destroy();
});

test('can create an order and get all for customer', async () => {
  const orders = await createOrders();

  await orders.create({
    customer: CUSTOMER,

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  });
  await timers.setTimeout(25);
  await orders.create({
    customer: CUSTOMER,

    product_name: 'cookie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '0.60',
    purchase_quantity: 500,

    deposit_amount: 5000000000000,
  });

  const allOrders = await orders.getAllForCustomer(CUSTOMER);
  expect(allOrders).toMatchObject([
    {
      product_name: 'cookie',

      purchase_currency: 'usd',
      purchase_price: '0.60',
      purchase_quantity: 500,
    },
    {
      product_name: 'brownie',

      purchase_currency: 'usd',
      purchase_price: '1.50',
      purchase_quantity: 200,
    },
  ]);
  expect(allOrders[0].id).toBeTruthy();
  expect(allOrders[0].created_at).toBeTruthy();
  expect(allOrders[1].id).toBeTruthy();
  expect(allOrders[1].created_at).toBeTruthy();

  await orders.destroy();
});
