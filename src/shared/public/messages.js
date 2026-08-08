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

  function showError(kind, message) {
    let notice = thread.querySelector(`[data-${kind}-error]`);
    if (!notice) {
      notice = document.createElement('div');
      notice.dataset[`${kind}Error`] = '';
      notice.className = 'sticky top-2 z-10 rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-center text-[12px] text-danger';
      notice.setAttribute('role', 'alert');
      thread.prepend(notice);
    }
    notice.textContent = message;
  }

  function clearError(kind) {
    thread.querySelector(`[data-${kind}-error]`)?.remove();
  }

  function nearBottom() {
    return thread.scrollHeight - thread.scrollTop - thread.clientHeight < 96;
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
      clearError('sound');
    } catch (error) {
      console.error('Could not play the new-message sound', error);
      showError('sound', 'A new message arrived, but sound is blocked. Tap the message box to enable it.');
    }
  }

  function patchEvents(nextThread) {
    const shouldStick = nearBottom();
    const current = new Map(Array.from(
      thread.querySelectorAll(':scope > [data-event-key]'),
      (node) => [node.dataset.eventKey, node],
    ));
    const nextEvents = Array.from(nextThread.querySelectorAll(':scope > [data-event-key]'));
    const nextKeys = new Set(nextEvents.map((node) => node.dataset.eventKey));
    let additions = 0;

    nextEvents.forEach((nextEvent, index) => {
      const existing = current.get(nextEvent.dataset.eventKey);
      if (existing) {
        if (existing.outerHTML !== nextEvent.outerHTML) {
          existing.replaceWith(nextEvent.cloneNode(true));
        }
        return;
      }

      additions += 1;
      const eventNodes = thread.querySelectorAll(':scope > [data-event-key]');
      thread.insertBefore(nextEvent.cloneNode(true), eventNodes[index] ?? null);
    });

    current.forEach((node, eventKeyValue) => {
      if (!nextKeys.has(eventKeyValue)) node.remove();
    });

    if (nextEvents.length) {
      thread.querySelector('[data-thread-empty]')?.remove();
    } else if (!thread.querySelector('[data-thread-empty]')) {
      const empty = nextThread.querySelector('[data-thread-empty]');
      if (empty) thread.append(empty.cloneNode(true));
    }

    return additions > 0 && shouldStick;
  }

  thread.addEventListener('click', (event) => {
    const button = event.target.closest('[data-chat-image]');
    const source = button?.querySelector('img')?.src;
    if (source) {
      window.parent.postMessage({
        type: 'openshop:view-image',
        source,
      }, window.location.origin);
    }
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
        signal: AbortSignal.timeout(15_000),
      });
      if (response.status === 304) {
        clearError('poll');
        if (forceBottom) scrollToBottom(true);
        forceBottom = false;
        return;
      }
      if (!response.ok) throw new Error(`Refresh returned ${response.status}`);

      const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
      const nextThread = parsed.querySelector('[data-chat]');
      if (!nextThread) throw new Error('Refresh response did not contain messages');

      clearError('poll');
      if (nextThread.dataset.version !== thread.dataset.version) {
        const stickForIncoming = patchEvents(nextThread);
        thread.dataset.version = nextThread.dataset.version;
        thread.dataset.lastIncoming = nextThread.dataset.lastIncoming;
        await notify(nextThread.dataset.lastIncoming ?? '');
        if (forceBottom || stickForIncoming) scrollToBottom(true);
      } else if (forceBottom) {
        scrollToBottom(true);
      }
      forceBottom = false;
    } catch (error) {
      console.error('Could not refresh chat messages', error);
      showError('poll', 'Messages could not refresh. OpenShop will keep trying.');
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
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) poll();
  });

  scrollToBottom();
  pollTimer = window.setTimeout(poll, 3_000);
})();
