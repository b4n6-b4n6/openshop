/* global document */
(() => {
  document.querySelectorAll('[data-qr-view]').forEach((view) => {
    const modal = view.querySelector('[data-qr-modal]');
    const saveError = view.querySelector('[data-qr-save-error]');
    const close = () => { modal.hidden = true; };
    const open = () => { modal.hidden = false; };

    view.querySelector('[data-qr-open]').addEventListener('click', () => {
      saveError.classList.add('hidden');
      open();
    });
    view.querySelector('[data-qr-close]').addEventListener('click', close);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) { close(); }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { close(); }
    });
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin
        || event.source !== messagesFrame.contentWindow
        || event.data?.type !== 'openshop:open-qr'
        || typeof event.data.source !== 'string') return;

      open();
    });

    view.querySelector('[data-qr-save]').addEventListener('click', async () => {
      try {
        const qr = modal.querySelector('[data-qr-image]');
        const logo = modal.querySelector('[data-qr-logo]');
        await Promise.all([qr, logo].map(async (image) => {
          if (!image.complete) await image.decode();
        }));

        const canvas = document.createElement('canvas');
        const output = canvas.getContext('2d');
        const size = 240;
        const logoSize = 78;
        const logoLeft = (size - logoSize) / 2;
        if (!output) throw new Error('Canvas is unavailable');

        canvas.width = size;
        canvas.height = size;
        output.fillStyle = '#ffffff';
        output.fillRect(0, 0, size, size);
        output.drawImage(qr, 0, 0, size, size);
        output.fillRect(logoLeft - 4, logoLeft - 4, logoSize + 8, logoSize + 8);
        output.drawImage(logo, logoLeft, logoLeft, logoSize, logoSize);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = view.dataset.fileName || 'openshop-qr.png';
        link.click();
      } catch (error) {
        console.error('Could not save QR code', error);
        saveError.textContent = 'The QR image could not be saved. Try again.';
        saveError.classList.remove('hidden');
      }
    });

    document.body.append(modal);
  });
})();
