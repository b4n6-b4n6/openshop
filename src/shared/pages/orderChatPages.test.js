import { chatPage, chatThreadPage, chatsPage } from './chatPages.js';
import { orderPage, ordersPage } from './orderPages.js';

const createdAt = new Date('2026-08-09T12:00:00.000Z');
const order = {
  created_at: createdAt,
  deposit_amount: '1230000000000',
  deposit_confirmed_at: null,
  deposit_detected_at: createdAt,
  deposit_txid: 'abc123',
  id: 'order-1',
  product_description: '[b]Private listing[/b]',
  product_name: 'Product',
  product_photo: null,
  purchase_currency: 'usd',
  purchase_price: '12.50',
  purchase_quantity: 2,
};

test('shared order lists link to the correct owner and customer routes', () => {
  const owner = ordersPage({ allOrders: [order], owner: true });
  const customer = ordersPage({ allOrders: [order] });

  expect(owner).toContain('href="/shop/orders/order-1"');
  expect(customer).toContain('href="/browser/orders/order-1"');
  expect(owner).toContain('Detected');
  expect(owner).toContain('1.23 XMR');
  expect(ordersPage({ allOrders: [] })).toContain('No orders yet');
});

test('order detail keeps payment, QR, rich text, and live status contracts', () => {
  const page = orderPage({
    order,
    depositAddress: '4exampleaddress',
    qr: 'data:image/png;base64,AAAA',
    version: 'order-version',
  });

  expect(page).toContain('1.23');
  expect(page).toContain('4exampleaddress');
  expect(page).toContain('data-qr-open');
  expect(page).toContain('data-qr-save');
  expect(page).toContain('Incoming transaction detected');
  expect(page).toContain('abc123');
  expect(page).toContain('data-order-live');
  expect(page).toContain('/static/order-status.js');
  expect(page).toContain('/static/copy.js');
});

test('chat shell polls only its thread and exposes smooth image sending UI', () => {
  const page = chatPage({
    action: '/browser/convo',
    back: '/browser/',
    thread: '/browser/convo/thread',
    title: 'shop.onion',
  });

  expect(page).toContain('src="/browser/convo/thread"');
  expect(page).toContain('data-chat-form');
  expect(page).toContain('data-chat-attachment');
  expect(page).toContain('/static/sound.js');
  expect(page).toContain('/static/chat.js');
  expect(page).not.toContain('http-equiv="refresh"');
});

test('chat thread renders messages, receipts, images, and order updates safely', () => {
  const page = chatThreadPage({
    allExtMessages: [{
      ext_message_occured_at: createdAt,
      ext_message_payload: {
        created_at: createdAt,
        read_at: createdAt,
        receiver: 'customer-1',
        sender: 'shop.onion',
        text_content: '<script>alert(1)</script>',
      },
      ext_message_type: 'CONVO',
      id: 'message-1',
    }, {
      ext_message_occured_at: createdAt,
      ext_message_payload: {
        created_at: createdAt,
        image_blur_preview: 'data:image/png;base64,BBBB',
        image_content_exists: true,
        receiver: 'shop.onion',
        sender: 'customer-1',
        text_content: null,
      },
      ext_message_type: 'CONVO',
      id: 'message-2',
    }, {
      ext_message_occured_at: createdAt,
      ext_message_payload: {
        created_at: createdAt,
        image_blur_preview: 'data:image/png;base64,CCCC',
        image_content_exists: true,
        read_at: createdAt,
        receiver: 'customer-1',
        sender: 'shop.onion',
        text_content: null,
      },
      ext_message_type: 'CONVO',
      id: 'message-3',
    }, {
      ext_message_occured_at: createdAt,
      ext_message_payload: {
        product_name: 'Product',
        product_photo: null,
        purchase_currency: 'usd',
        purchase_price: '12.50',
        purchase_quantity: 2,
      },
      ext_message_type: 'NEW_ORDER_CREATED',
      id: 'order-1',
    }],
    chatId: 'customer-1',
    imageBase: '/shop/convos/images',
    me: 'shop.onion',
    orderBase: '/shop/orders',
    owner: true,
    version: 'chat-version',
  });

  expect(page).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  expect(page).not.toContain('<script>alert(1)</script>');
  expect(page).toContain('src="data:image/png;base64,BBBB"');
  expect(page).not.toMatch(/<img[^>]+\ssrc="\/shop\/convos\/images\/message-2/);
  expect(page).toContain('data-src="/shop/convos/images/message-2?inline=1"');
  expect(page).toContain('data-chat-image-load');
  expect(page).toContain('aria-label="Download and display image"');
  expect(page).toContain('data-chat-image class="chat-image-loaded"');
  expect(page).toContain('src="/shop/convos/images/message-3?inline=1"');
  expect(page).not.toContain('data-src="/shop/convos/images/message-3?inline=1"');
  expect(page).toContain('class="chat-image-message"');
  expect(page).not.toContain('ago');
  expect(page).toContain('aria-label="Read"');
  expect(page).toContain('New order');
  expect(page).toContain('href="/shop/orders/order-1" target="_top"');
  expect(page).toContain('/static/messages.js');
});

test('owner chat list retains unread state without meta refresh', () => {
  const page = chatsPage({
    chats: [{
      id: 'customer-1',
      last_message_at: createdAt,
      unread: true,
    }],
    version: 'list-version',
  });

  expect(page).toContain('href="/shop/convos/customer-1"');
  expect(page).toContain('aria-label="Unread messages"');
  expect(page).toContain('/static/chat-list.js');
  expect(page).not.toContain('http-equiv="refresh"');
});
