/* global document, window */
(() => {
  const thread = document.querySelector('[data-chat]');
  if (!thread) return;

  function scrollToBottom(smooth = false) {
    thread.scrollTo({
      top: thread.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }

  thread.addEventListener('click', (event) => {
    const loadButton = event.target.closest('[data-chat-image-load]');
    if (loadButton) {
      const eventNode = loadButton.closest('[data-event-key]');
      const image = eventNode?.querySelector('[data-chat-image-content]');
      const source = image?.dataset.src;

      if (source) {
        window.parent.postMessage({
          type: 'openshop:view-image',
          source,
        }, window.location.origin);

        return;
      }
    }

    const viewerButton = event.target.closest('[data-chat-image]');
    if (viewerButton) {
      const source = viewerButton.querySelector('img')?.dataset.src;
      if (source) {
        window.parent.postMessage({
          type: 'openshop:view-image',
          source,
        }, window.location.origin);
      }
    }
  });

  const key = `openshop-last-message:${thread.dataset.chat ?? ''}`;
  const lastIncomingVer = sessionStorage.getItem(key);
  const currentIncomingVer = thread.dataset.lastIncoming;

  if (lastIncomingVer === null || lastIncomingVer !== currentIncomingVer) {
    sessionStorage.setItem(key, currentIncomingVer);

    console.log('Scrolling to bottom');
    scrollToBottom();
  }

  console.log('Hello from messages.js');
})();
