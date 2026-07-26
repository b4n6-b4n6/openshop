/* global DOMParser, document, window */
(() => {
  const thread = document.querySelector('[data-chat]');
  if (!thread) return;

  const key = `openshop-last-message:${thread.dataset.chat ?? ''}`;
  let knownIncoming = sessionStorage.getItem(key);
  let forceBottom = false;
  let pollTimer;

  if (knownIncoming === null) {
    knownIncoming = thread.dataset.lastIncoming ?? '';
    sessionStorage.setItem(key, knownIncoming);
  }

  function showError(message) {
    let notice = thread.querySelector('[data-poll-error]');
    if (!notice) {
      notice = document.createElement('div');
      notice.dataset.pollError = '';
      notice.className = 'sticky top-2 z-10 rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-center text-[12px] text-danger';
      notice.setAttribute('role', 'alert');
      thread.prepend(notice);
    }
    notice.textContent = message;
  }

  function clearError() {
    thread.querySelector('[data-poll-error]')?.remove();
  }

  function scrollToBottom(smooth = false) {
    thread.scrollTo({
      top: thread.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }

  async function notify(incoming) {
    if (!incoming || incoming === knownIncoming) return;
    knownIncoming = incoming;
    sessionStorage.setItem(key, incoming);
    try {
      if (typeof window.parent.handleOpenShopIncoming === 'function') {
        await window.parent.handleOpenShopIncoming(incoming);
      } else if (typeof window.parent.playMessageTing === 'function') {
        await window.parent.playMessageTing();
      } else {
        throw new Error('The notification sound player is unavailable');
      }
    } catch (error) {
      console.error('Could not play the new-message sound', error);
      showError('A new message arrived, but sound is blocked. Tap the message box to enable it.');
    }
  }

  function openImage(source) {
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.innerHTML = '<button type="button" aria-label="Close image preview">×</button><img alt="Image attachment preview">';
    viewer.querySelector('img').src = source;
    const close = () => viewer.remove();
    viewer.addEventListener('click', close);
    viewer.querySelector('img').addEventListener('click', (event) => event.stopPropagation());
    viewer.querySelector('button').addEventListener('click', close);
    document.body.append(viewer);
  }

  thread.addEventListener('click', (event) => {
    const button = event.target.closest('[data-chat-image]');
    const source = button?.querySelector('img')?.src;
    if (source) openImage(source);
  });

  async function poll() {
    window.clearTimeout(pollTimer);
    try {
      const response = await fetch(window.location.href, {
        cache: 'no-store',
        headers: {
          Accept: 'text/html',
          'If-None-Match': `"${thread.dataset.version}"`,
        },
        signal: AbortSignal.timeout(10_000),
      });
      if (response.status === 304) {
        clearError();
        return;
      }
      if (!response.ok) throw new Error(`Refresh returned ${response.status}`);

      const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
      const nextThread = parsed.querySelector('[data-chat]');
      if (!nextThread) throw new Error('Refresh response did not contain messages');

      clearError();
      if (nextThread.dataset.version !== thread.dataset.version) {
        const currentMessages = Array.from(thread.querySelectorAll('[data-message-id]'));
        const currentIds = new Set(
          currentMessages.map((message) => message.dataset.messageId),
        );
        const nextMessages = Array.from(
          nextThread.querySelectorAll('[data-message-id]'),
        );
        const additions = nextMessages.filter(
          (message) => !currentIds.has(message.dataset.messageId),
        );
        const appendOnly = currentMessages.length + additions.length === nextMessages.length;

        if (appendOnly) {
          thread.querySelector('[data-thread-empty]')?.remove();
          additions.forEach((message) => thread.append(message.cloneNode(true)));
        } else {
          thread.innerHTML = nextThread.innerHTML;
        }
        thread.dataset.version = nextThread.dataset.version;
        thread.dataset.lastIncoming = nextThread.dataset.lastIncoming;
        await notify(nextThread.dataset.lastIncoming ?? '');
        scrollToBottom(true);
        forceBottom = false;
      } else if (forceBottom) {
        scrollToBottom(true);
        forceBottom = false;
      }
    } catch (error) {
      console.error('Could not refresh chat messages', error);
      showError('Messages could not refresh. OpenShop will keep trying.');
    } finally {
      pollTimer = window.setTimeout(poll, 3_000);
    }
  }

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin
      || event.data?.type !== 'openshop:refresh-messages') return;
    forceBottom = Boolean(event.data.stickToBottom);
    poll();
  });

  scrollToBottom();
  pollTimer = window.setTimeout(poll, 3_000);
})();
