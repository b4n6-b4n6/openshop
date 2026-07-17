import { randomUUID } from 'node:crypto';
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

    deposit_address: '888tNkZrPN6Js...',
    deposit_amount: 2000000000000,
  });

  const order = await orders.get(id);
  expect(order).toMatchObject({
    customer: CUSTOMER,

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_address: '888tNkZrPN6Js...',
    deposit_amount: 2000000000000,
  });
  expect(order.created_at).toBeTruthy();

  await orders.destroy();
});
