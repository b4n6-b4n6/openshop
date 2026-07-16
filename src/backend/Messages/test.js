import { randomUUID } from 'node:crypto';
import timers from 'node:timers/promises';
import createMessages from './index.js';

const SHOP_ADDRESS = '2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion';
const CUSTOMER_ID = '370c6cbe-8a6c-4d77-8070-bc21c32fc904';

test('can get a non-existent image message', async () => {
  const messages = await createMessages();

  expect(
    await messages.getImageContent(randomUUID()),
  ).toEqual(undefined);

  await messages.destroy();
});

test('can get an empty convo', async () => {
  const messages = await createMessages();

  expect(await messages.getConvo([SHOP_ADDRESS, CUSTOMER_ID])).toEqual([]);

  await messages.destroy();
});

test('can create a text message & get convo', async () => {
  const messages = await createMessages();

  await messages.create({
    text_content: 'hello', sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  const convo = await messages.getConvo([SHOP_ADDRESS, CUSTOMER_ID]);

  expect(convo).toMatchObject([{
    sender: CUSTOMER_ID,
    receiver: SHOP_ADDRESS,
    text_content: 'hello',
  }]);
  expect(convo[0].id).toBeTruthy();
  expect(convo[0].created_at).toBeTruthy();

  await messages.destroy();
});

test('can create a text message, mark it as received & get convo', async () => {
  const messages = await createMessages();

  await messages.create({
    text_content: 'hello', sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  await messages.markAllReceivedInConvo({
    sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  const convo = await messages.getConvo([SHOP_ADDRESS, CUSTOMER_ID]);

  expect(convo).toMatchObject([{
    sender: CUSTOMER_ID,
    receiver: SHOP_ADDRESS,
    text_content: 'hello',
  }]);
  expect(convo[0].id).toBeTruthy();
  expect(convo[0].created_at).toBeTruthy();
  expect(convo[0].received_at).toBeTruthy();

  await messages.destroy();
});

test('can create a text message, mark it as read & get convo', async () => {
  const messages = await createMessages();

  await messages.create({
    text_content: 'hello', sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  await messages.markAllReadInConvo({
    sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  const convo = await messages.getConvo([SHOP_ADDRESS, CUSTOMER_ID]);

  expect(convo).toMatchObject([{
    sender: CUSTOMER_ID,
    receiver: SHOP_ADDRESS,
    text_content: 'hello',
  }]);
  expect(convo[0].id).toBeTruthy();
  expect(convo[0].created_at).toBeTruthy();
  expect(convo[0].received_at).toBeTruthy();
  expect(convo[0].read_at).toBeTruthy();

  await messages.destroy();
});

test('can create a text messages, mark it as read, create another text message & get convo', async () => {
  const messages = await createMessages();

  await messages.create({
    text_content: 'hello', sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  await timers.setTimeout(25);

  await messages.markAllReadInConvo({
    sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });

  await messages.create({
    text_content: 'hi', sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  const convo = await messages.getConvo([SHOP_ADDRESS, CUSTOMER_ID]);

  expect(convo).toMatchObject([{
    sender: CUSTOMER_ID,
    receiver: SHOP_ADDRESS,
    text_content: 'hello',
  }, {
    sender: CUSTOMER_ID,
    receiver: SHOP_ADDRESS,
    text_content: 'hi',
  }]);
  expect(convo[0].id).toBeTruthy();
  expect(convo[0].created_at).toBeTruthy();
  expect(convo[0].received_at).toBeTruthy();
  expect(convo[0].read_at).toBeTruthy();
  expect(convo[1].id).toBeTruthy();
  expect(convo[1].created_at).toBeTruthy();
  expect(convo[1].received_at).toBeFalsy();
  expect(convo[1].read_at).toBeFalsy();

  await messages.destroy();
});

test('can create a few text messages & get convo', async () => {
  const messages = await createMessages();

  await messages.create({
    text_content: 'hello', sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  await timers.setTimeout(25);
  await messages.create({
    text_content: 'hi', sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  const convo = await messages.getConvo([SHOP_ADDRESS, CUSTOMER_ID]);

  expect(convo).toMatchObject([{
    sender: CUSTOMER_ID,
    receiver: SHOP_ADDRESS,
    text_content: 'hello',
  }, {
    sender: CUSTOMER_ID,
    receiver: SHOP_ADDRESS,
    text_content: 'hi',
  }]);
  expect(convo[0].id).toBeTruthy();
  expect(convo[0].created_at).toBeTruthy();
  expect(convo[1].id).toBeTruthy();
  expect(convo[1].created_at).toBeTruthy();

  await messages.destroy();
});

test('can create 2-way text messages & get convo', async () => {
  const messages = await createMessages();

  await messages.create({
    text_content: 'hello', sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  await timers.setTimeout(25);
  await messages.create({
    text_content: 'how can i help u today?', sender: SHOP_ADDRESS, receiver: CUSTOMER_ID,
  });
  const convo = await messages.getConvo([SHOP_ADDRESS, CUSTOMER_ID]);

  expect(convo).toMatchObject([{
    sender: CUSTOMER_ID,
    receiver: SHOP_ADDRESS,
    text_content: 'hello',
  }, {
    sender: SHOP_ADDRESS,
    receiver: CUSTOMER_ID,
    text_content: 'how can i help u today?',
  }]);
  expect(convo[0].id).toBeTruthy();
  expect(convo[0].created_at).toBeTruthy();
  expect(convo[1].id).toBeTruthy();
  expect(convo[1].created_at).toBeTruthy();

  await messages.destroy();
});

test('conversation summary identifies the latest sender', async () => {
  const messages = await createMessages();

  await messages.create({
    text_content: 'hello', sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  await timers.setTimeout(25);
  await messages.create({
    text_content: 'hello back', sender: SHOP_ADDRESS, receiver: CUSTOMER_ID,
  });

  expect(await messages.getConvos(CUSTOMER_ID)).toMatchObject([{
    id: SHOP_ADDRESS,
    last_message_sender: SHOP_ADDRESS,
  }]);

  await messages.destroy();
});

test('can create 2-way text messages, mark it as read & get convo', async () => {
  const messages = await createMessages();

  await messages.create({
    text_content: 'hello', sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  await timers.setTimeout(25);
  await messages.create({
    text_content: 'how can i help u today?', sender: SHOP_ADDRESS, receiver: CUSTOMER_ID,
  });
  await messages.markAllReadInConvo({ sender: CUSTOMER_ID, receiver: SHOP_ADDRESS });
  const convo = await messages.getConvo([SHOP_ADDRESS, CUSTOMER_ID]);

  expect(convo).toMatchObject([{
    sender: CUSTOMER_ID,
    receiver: SHOP_ADDRESS,
    text_content: 'hello',
  }, {
    sender: SHOP_ADDRESS,
    receiver: CUSTOMER_ID,
    text_content: 'how can i help u today?',
  }]);
  expect(convo[0].id).toBeTruthy();
  expect(convo[0].created_at).toBeTruthy();
  expect(convo[0].received_at).toBeTruthy();
  expect(convo[0].read_at).toBeTruthy();
  expect(convo[1].id).toBeTruthy();
  expect(convo[1].created_at).toBeTruthy();
  expect(convo[1].received_at).toBeFalsy();
  expect(convo[1].read_at).toBeFalsy();

  await messages.destroy();
});

test('can create an image message & get it', async () => {
  const messages = await createMessages();

  await messages.create({
    image_content: Buffer.from('1234abcd', 'hex'), sender: CUSTOMER_ID, receiver: SHOP_ADDRESS,
  });
  const convo = await messages.getConvo([SHOP_ADDRESS, CUSTOMER_ID]);

  expect(convo).toMatchObject([{
    sender: CUSTOMER_ID,
    receiver: SHOP_ADDRESS,
    text_content: null,
  }]);
  expect(convo[0].id).toBeTruthy();
  expect(convo[0].created_at).toBeTruthy();

  expect(
    await messages.getImageContent(convo[0].id),
  ).toEqual(Buffer.from('1234abcd', 'hex'));

  await messages.destroy();
});
