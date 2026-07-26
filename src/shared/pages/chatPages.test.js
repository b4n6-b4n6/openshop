import {
  chatPage,
  chatsPage,
  chatThreadPage,
} from './chatPages.js';

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';

test('owner chats render unread dots and global notification polling', () => {
  const page = chatsPage({
    owner: true,
    chats: [{ id: 'customer-1', unread: true }],
  });

  expect(page).toContain('data-unread-dot');
  expect(page).toContain('data-chat-id="customer-1"');
  expect(page).toContain('owner-notifications.js?');
});

test('chat composer supports background send and attachment feedback', () => {
  const page = chatPage({ chatId: 'customer-1' });

  expect(page).toContain('data-chat-form');
  expect(page).toContain('data-chat-attachment');
  expect(page).toContain('sound.js?');
  expect(page).toContain('chat.js?');
});

test('image messages render inline without exposing a base64 download link', () => {
  const page = chatThreadPage({
    chatId: 'customer-1',
    me: 'owner',
    messages: [{
      id: 'message-1',
      sender: 'customer-1',
      image_content: Buffer.from(PNG),
      created_at: new Date(),
    }],
  });

  expect(page).toContain('data-chat-image');
  expect(page).toContain('<img src="data:image/png;base64,');
  expect(page).not.toContain('download=');
  expect(page).not.toContain('<a href="data:image/');
});
