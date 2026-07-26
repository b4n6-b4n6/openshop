/* global DOMParser, document, window */
(() => {
  const latestKey = 'openshop-owner-latest-incoming';
  let knownIncoming = sessionStorage.getItem(latestKey);
  let timer;

  function showError(message) {
    let notice = document.querySelector('[data-notification-error]');
    if (!notice) {
      notice = document.createElement('div');
      notice.dataset.notificationError = '';
      notice.className = 'notification-error';
      notice.setAttribute('role', 'alert');
      document.body.append(notice);
    }
    notice.textContent = message;
  }

  function clearError() {
    document.querySelector('[data-notification-error]')?.remove();
  }

  function renderUnread(unreadChatIds) {
    const unread = new Set(unreadChatIds);
    document.querySelectorAll('[data-unread-dot]').forEach((dot) => {
      const { chatId } = dot.dataset;
      const visible = chatId ? unread.has(chatId) : unread.size > 0;
      dot.classList.toggle('hidden', !visible);
      dot.classList.toggle('block', visible);
    });
  }

  window.handleOpenShopIncoming = async (incoming) => {
    if (!incoming || incoming === knownIncoming) return;
    const firstCheck = knownIncoming === null;
    knownIncoming = incoming;
    sessionStorage.setItem(latestKey, incoming);
    if (firstCheck) return;

    try {
      await window.playMessageTing();
    } catch (error) {
      console.error('Could not play the new-message sound', error);
      showError('A new message arrived, but sound is blocked. Tap the page to enable it.');
    }
  };

  async function poll() {
    window.clearTimeout(timer);
    try {
      const response = await fetch('/shop/chat-status', {
        cache: 'no-store',
        headers: { Accept: 'text/html' },
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error(`Notification check returned ${response.status}`);
      const parsed = new DOMParser().parseFromString(
        await response.text(),
        'text/html',
      );
      const state = parsed.querySelector('[data-chat-status]');
      if (!state) throw new Error('Notification check returned invalid HTML');
      const unreadChatIds = Array.from(
        state.querySelectorAll('[data-unread-chat]'),
        (chat) => chat.dataset.unreadChat,
      );
      clearError();
      renderUnread(unreadChatIds);
      await window.handleOpenShopIncoming(state.dataset.latestIncoming);
    } catch (error) {
      console.error('Could not check for new owner messages', error);
      showError('New-message checks are unavailable. OpenShop will keep trying.');
    } finally {
      timer = window.setTimeout(poll, 3_000);
    }
  }

  poll();
})();
