/* global document, window */
(() => {
  const thread = document.querySelector('[data-chat]');
  if (!thread) return;

  const key = `openshop-last-message:${thread.dataset.chat ?? ''}`;
  let knownIncoming = sessionStorage.getItem(key);

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

  thread.addEventListener('click', (event) => {
    const loadButton = event.target.closest('[data-chat-image-load]');
    if (loadButton) {
      const eventNode = loadButton.closest('[data-event-key]');
      const image = eventNode?.querySelector('[data-chat-image-content]');
      const source = image?.dataset.src;
      if (!eventNode || !image || !source) {
        showError('image', 'This image cannot be downloaded.');
        return;
      }

      window.parent.postMessage({
        type: 'openshop:view-image',
        source,
      }, window.location.origin);
      return;
    }

    const viewerButton = event.target.closest('[data-chat-image]');
    const source = viewerButton?.querySelector('img')?.src;
    if (source) {
      window.parent.postMessage({
        type: 'openshop:view-image',
        source,
      }, window.location.origin);
    }
  });

  async function poll() {
    window.location.reload();
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) poll();
  });
})();
