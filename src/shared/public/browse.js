/* global BarcodeDetector, createImageBitmap, document */
(() => {
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

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!('BarcodeDetector' in globalThis)) {
      showError('QR scanning is not supported by this browser. Paste the onion address instead.');
      return;
    }

    try {
      const image = await createImageBitmap(file);
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const [result] = await detector.detect(image);
      image.close();
      const onion = result?.rawValue?.match(/([a-z2-7]{56}\.onion)/i)?.[1];
      if (!onion) throw new Error('No onion address in QR code');
      onionInput.value = onion.toLowerCase();
      onionInput.focus();
    } catch {
      showError('No valid OpenShop onion address was found in that QR code.');
    }
  });
})();
