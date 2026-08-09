/* global createImageBitmap, document */
(() => {
  const MAX_QR_DIMENSION = 1600;
  const form = document.querySelector('[data-browse-form]');
  const submit = form?.querySelector('[type="submit"]');
  const trigger = document.querySelector('[data-scan-qr]');
  const fileInput = document.querySelector('[data-qr-file]');
  const onionInput = document.querySelector('input[name="browsed_onion_address"]');
  const error = document.querySelector('[data-qr-error]');
  if (!form || !submit || !trigger || !fileInput || !onionInput || !error) return;

  form.addEventListener('submit', () => {
    form.classList.add('submitting');
    submit.disabled = true;
    submit.textContent = 'Connecting…';
    onionInput.readOnly = true;
  });

  const showError = (message) => {
    error.textContent = message;
    error.classList.remove('hidden');
  };

  trigger.addEventListener('click', () => {
    error.classList.add('hidden');
    fileInput.click();
  });

  const decodeQr = async (file) => {
    if (typeof globalThis.jsQR !== 'function') {
      throw new Error('QR decoder did not load');
    }
    const image = await createImageBitmap(file);
    try {
      const scale = Math.min(
        1,
        MAX_QR_DIMENSION / Math.max(image.width, image.height),
      );
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Could not read QR image');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      return globalThis.jsQR(pixels.data, pixels.width, pixels.height, {
        inversionAttempts: 'attemptBoth',
      })?.data;
    } finally {
      image.close();
    }
  };

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    try {
      const decoded = await decodeQr(file);
      const onion = decoded?.match(/([a-z2-7]{56}\.onion)/i)?.[1];
      if (!onion) throw new Error('No onion address in QR code');
      onionInput.value = onion.toLowerCase();
      onionInput.focus();
      error.classList.add('hidden');
    } catch (decodeError) {
      console.error('Could not scan QR code', decodeError);
      showError('No valid OpenShop onion address was found in that QR code.');
    }
  });
})();
