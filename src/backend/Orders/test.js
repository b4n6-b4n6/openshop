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

test('can create an order and mark deposit as detected', async () => {
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
  await orders.markDepositDetected({
    deposit_amount: 2000000000000,
  });

  const order = await orders.get(id);
  expect(order.deposit_detected_at).toBeTruthy();

  await orders.destroy();
});

test('cannot create an order with negative price', async () => {
  const orders = await createOrders();

  await expect(orders.create({
    customer: CUSTOMER,

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '-1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  })).rejects.toThrow('new row for relation "orders" violates check constraint "orders_purchase_price_check"');

  await orders.destroy();
});

test('cannot create an order with negative quantity', async () => {
  const orders = await createOrders();

  await expect(orders.create({
    customer: CUSTOMER,

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: -200,

    deposit_amount: 2000000000000,
  })).rejects.toThrow('new row for relation "orders" violates check constraint "orders_purchase_quantity_check"');

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

test('can create an order with identical deposit amount and on txid', async () => {
  const orders = await createOrders();

  const id_1 = await orders.create({
    customer: CUSTOMER,

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  });
  const order_1 = await orders.get(id_1);
  expect(order_1).toMatchObject({
    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  });
  expect(order_1.created_at).toBeTruthy();

  await orders.setDepositTxid({
    deposit_amount: 2000000000000,
    deposit_txid: 'abcd',
  });

  const id_2 = await orders.create({
    customer: CUSTOMER,

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  });
  const order_2 = await orders.get(id_2);
  expect(order_2).toMatchObject({
    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 200,

    deposit_amount: 2000000000000,
  });
  expect(order_2.created_at).toBeTruthy();

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

test('can create an order and get as ext. messages', async () => {
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

  const allExtMessages = await orders.getAllForCustomerAsExtMessages(CUSTOMER);
  expect(allExtMessages.length).toBe(1);
  expect(allExtMessages[0].ext_message_type).toBe('NEW_ORDER_CREATED');
  expect(allExtMessages[0].ext_message_occured_at).toBeTruthy();
  expect(allExtMessages[0].id).toBeTruthy();

  await orders.destroy();
});

test('can create an order and get as ext. messages including deposit detected', async () => {
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
  await orders.markDepositDetected({
    deposit_amount: 2000000000000,
  });

  const allExtMessages = await orders.getAllForCustomerAsExtMessages(CUSTOMER);
  expect(allExtMessages.length).toBe(2);
  expect(allExtMessages[0].id).toBeTruthy();
  expect(allExtMessages[0].ext_message_occured_at).toBeTruthy();
  expect(allExtMessages[0].ext_message_type).toBe('ORDER_DEPOSIT_DETECTED');
  expect(allExtMessages[1].id).toBeTruthy();
  expect(allExtMessages[1].ext_message_occured_at).toBeTruthy();
  expect(allExtMessages[1].ext_message_type).toBe('NEW_ORDER_CREATED');

  await orders.destroy();
});

test('can create an order and get as ext. messages including deposit confirmed', async () => {
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
  await orders.markDepositDetected({
    deposit_amount: 2000000000000,
  });
  await timers.setTimeout(25);
  await orders.markDepositConfirmed({
    deposit_amount: 2000000000000,
  });

  const allExtMessages = await orders.getAllForCustomerAsExtMessages(CUSTOMER);
  expect(allExtMessages[0].id).toBeTruthy();
  expect(allExtMessages[0].ext_message_occured_at).toBeTruthy();
  expect(allExtMessages[0].ext_message_type).toBe('ORDER_DEPOSIT_CONFIRMED');
  expect(allExtMessages[1].id).toBeTruthy();
  expect(allExtMessages[1].ext_message_occured_at).toBeTruthy();
  expect(allExtMessages[1].ext_message_type).toBe('ORDER_DEPOSIT_DETECTED');
  expect(allExtMessages[2].id).toBeTruthy();
  expect(allExtMessages[2].ext_message_occured_at).toBeTruthy();
  expect(allExtMessages[2].ext_message_type).toBe('NEW_ORDER_CREATED');

  await orders.destroy();
});

test('can create many orders and get as ext. messages', async () => {
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

    product_name: 'brownie',
    product_description: 'coco!',

    purchase_currency: 'usd',
    purchase_price: '1.50',
    purchase_quantity: 300,

    deposit_amount: 3000000000000,
  });

  const allExtMessages = await orders.getAllForCustomerAsExtMessages(CUSTOMER);
  expect(allExtMessages.length).toBe(2);
  expect(allExtMessages[0].id).toBeTruthy();
  expect(allExtMessages[0].ext_message_occured_at).toBeTruthy();
  expect(allExtMessages[0].ext_message_type).toBe('NEW_ORDER_CREATED');
  expect(allExtMessages[1].id).toBeTruthy();
  expect(allExtMessages[1].ext_message_occured_at).toBeTruthy();
  expect(allExtMessages[1].ext_message_type).toBe('NEW_ORDER_CREATED');

  await orders.destroy();
});
