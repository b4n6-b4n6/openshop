/* global DOMParser, document, window */
(() => {
  const list = document.querySelector('[data-chat-list]');
  if (!list) return;
  let timer;

  function showError(message) {
    let notice = document.querySelector('[data-chat-list-error]');
    if (!notice) {
      notice = document.createElement('div');
      notice.dataset.chatListError = '';
      notice.className = 'mx-5 mt-4 rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-center text-[12px] text-danger';
      notice.setAttribute('role', 'alert');
      list.before(notice);
    }
    notice.textContent = message;
  }

  function clearError() {
    document.querySelector('[data-chat-list-error]')?.remove();
  }

  async function poll() {
    window.clearTimeout(timer);
    try {
      const response = await fetch(window.location.href, {
        cache: 'no-store',
        headers: {
          Accept: 'text/html',
          'If-None-Match': `"${list.dataset.version}"`,
        },
        signal: AbortSignal.timeout(10_000),
      });
      if (response.status === 304) {
        clearError();
        return;
      }
      if (!response.ok) throw new Error(`Chat list refresh returned ${response.status}`);
      const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
      const next = parsed.querySelector('[data-chat-list]');
      if (!next) throw new Error('Chat list refresh returned invalid HTML');
      clearError();
      if (next.dataset.version !== list.dataset.version) {
        list.replaceChildren(...Array.from(next.childNodes, (node) => node.cloneNode(true)));
        list.dataset.version = next.dataset.version;
      }
    } catch (error) {
      console.error('Could not refresh chats', error);
      showError('Chats could not refresh. OpenShop will keep trying.');
    } finally {
      timer = window.setTimeout(poll, 5_000);
    }
  }

  poll();
})();
