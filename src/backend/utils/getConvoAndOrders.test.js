import timers from 'node:timers/promises';
import createPool from '../createPool.js';
import createOrders from '../Orders/index.js';
import createMessages from '../Messages/index.js';
import getConvoAndOrders from './getConvoAndOrders.js';

const SHOP_ADDRESS = '2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion';
const CUSTOMER = '370c6cbe-8a6c-4d77-8070-bc21c32fc904';

test('can get none', async () => {
  const pool = createPool();
  await createOrders(pool);
  await createMessages(pool);

  const allExtMessages = await getConvoAndOrders({ pool });
  expect(allExtMessages).toEqual([]);

  await pool.end();
});

test('can get some', async () => {
  const pool = createPool();
  const orders = await createOrders(pool);
  const messages = await createMessages(pool);

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
  await messages.create({
    text_content: 'hello', sender: CUSTOMER, receiver: SHOP_ADDRESS,
  });
  await timers.setTimeout(25);
  await orders.markDepositDetected({
    deposit_amount: 2000000000000,
  });

  const allExtMessages = await getConvoAndOrders({ pool, customer: CUSTOMER });
  expect(allExtMessages).toMatchObject([
    {
      ext_message_type: 'NEW_ORDER_CREATED',
      ext_message_payload: {
        product_name: 'brownie',
        product_photo: null,
        purchase_currency: 'usd',
        purchase_price: '1.50',
        purchase_quantity: 200,
      },
    },
    {
      ext_message_type: 'CONVO',
      ext_message_payload: {
        text_content: 'hello',
      },
    },
    {
      ext_message_type: 'ORDER_DEPOSIT_DETECTED',
      ext_message_payload: {
        product_name: 'brownie',
        product_photo: null,
        purchase_currency: 'usd',
        purchase_price: '1.50',
        purchase_quantity: 200,
      },
    },
  ]);
  expect(allExtMessages.length).toBe(3);
  expect(allExtMessages[2].id).toBeTruthy();
  expect(allExtMessages[2].ext_message_occured_at).toBeTruthy();
  expect(allExtMessages[1].id).toBeTruthy();
  expect(allExtMessages[1].ext_message_occured_at).toBeTruthy();
  expect(allExtMessages[1].ext_message_payload.sender).toBeTruthy();
  expect(allExtMessages[1].ext_message_payload.receiver).toBeTruthy();
  expect(allExtMessages[1].ext_message_payload.created_at).toBeTruthy();
  expect(allExtMessages[0].id).toBeTruthy();
  expect(allExtMessages[0].ext_message_occured_at).toBeTruthy();

  await pool.end();
});
