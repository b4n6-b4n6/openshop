/* global DOMParser, document, window */
(() => {
  const order = document.querySelector('[data-order-live]');
  if (!order || order.dataset.complete === 'true') return;
  let timer;

  function showError(message) {
    let notice = order.querySelector('[data-order-poll-error]');
    if (!notice) {
      notice = document.createElement('div');
      notice.dataset.orderPollError = '';
      notice.className = 'rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-center text-[12px] text-danger';
      notice.setAttribute('role', 'alert');
      order.prepend(notice);
    }
    notice.textContent = message;
  }

  function clearError() {
    order.querySelector('[data-order-poll-error]')?.remove();
  }

  async function poll() {
    window.clearTimeout(timer);
    try {
      const response = await fetch(window.location.href, {
        cache: 'no-store',
        headers: {
          Accept: 'text/html',
          'If-None-Match': `"${order.dataset.version}"`,
        },
        signal: AbortSignal.timeout(15_000),
      });
      if (response.status === 304) {
        clearError();
        return;
      }
      if (!response.ok) throw new Error(`Order refresh returned ${response.status}`);
      const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
      const next = parsed.querySelector('[data-order-live]');
      if (!next) throw new Error('Order refresh returned invalid HTML');
      clearError();
      if (next.dataset.version !== order.dataset.version) {
        ['[data-order-status-badge]', '[data-order-status-message]', '[data-order-txid]']
          .forEach((selector) => {
            const currentSlot = order.querySelector(selector);
            const nextSlot = next.querySelector(selector);
            if (currentSlot && nextSlot) currentSlot.replaceWith(nextSlot.cloneNode(true));
          });
        order.dataset.version = next.dataset.version;
        order.dataset.complete = next.dataset.complete;
      }
    } catch (error) {
      console.error('Could not refresh order status', error);
      showError('Order status could not refresh. OpenShop will keep trying.');
    } finally {
      if (order.dataset.complete !== 'true') {
        timer = window.setTimeout(poll, 10_000);
      }
    }
  }

  timer = window.setTimeout(poll, 5_000);
})();
