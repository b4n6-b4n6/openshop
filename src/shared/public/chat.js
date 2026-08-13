/* global document, window */
(() => {
  const icon = (name, classes = 'size-5') => {
    const paths = {
      arrowLeft: '<path d="m15 18-6-6 6-6"/>',
      bold: '<path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/>',
      boxes: '<path d="m3 8 9-5 9 5v8l-9 5-9-5Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
      chevronRight: '<path d="m9 18 6-6-6-6"/>',
      check: '<path d="m20 6-11 11-5-5"/>',
      checkCheck: '<path d="m18 6-11 11-5-5"/><path d="m22 10-7.5 7.5L13 16"/>',
      copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
      download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
      eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
      globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/>',
      image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
      italic: '<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>',
      message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
      pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
      plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
      power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
      qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
      receipt: '<path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2Z"/><path d="M16 8h-6"/><path d="M16 12h-6"/><path d="M13 16h-3"/>',
      send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
      store: '<path d="M3 9V7l2-4h14l2 4v2"/><path d="M5 13v8h14v-8"/><path d="M9 21v-6h6v6"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
      wallet: '<path d="M20 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v8a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7"/><path d="M16 14h.01"/>',
      wifiOff: '<path d="M12 20h.01"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/><path d="M5 12.86a10 10 0 0 1 5.17-2.69"/><path d="M19 12.86a10 10 0 0 0-2.01-1.52"/><path d="M2 8.82a15 15 0 0 1 4.18-2.64"/><path d="M22 8.82a15 15 0 0 0-11.29-3.76"/><path d="m2 2 20 20"/>',
      close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    };

    return `<svg class="${classes}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? ''}</svg>`;
  };

  const UPLOAD_FILE_MAX_SIZE = 10 * 1024 * 1024;
  let submitting = false;

  const form = document.querySelector('[data-chat-form]');
  if (!form) return;

  const fileInput = form.querySelector('[data-chat-file]');
  const attachment = form.querySelector('[data-chat-attachment]');
  const attachmentName = form.querySelector('[data-chat-attachment-name]');
  const attachmentPreview = form.querySelector('[data-chat-attachment-preview]');
  const removeAttachment = form.querySelector('[data-chat-attachment-remove]');
  const sendButton = form.querySelector('[data-chat-send]');
  const errorNotice = form.querySelector('[data-chat-error]');
  const messageInput = form.elements.text;
  const messagesFrame = form.querySelector('[data-chat-frame]');
  let previewUrl;

  function showError(message) {
    errorNotice.textContent = message;
    errorNotice.classList.remove('hidden');
  }

  function clearError() {
    errorNotice.textContent = '';
    errorNotice.classList.add('hidden');
  }

  function clearAttachment() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = undefined;
    fileInput.value = '';
    attachmentPreview.removeAttribute('src');
    attachmentName.textContent = '';
    attachment.classList.add('hidden');
    attachment.classList.remove('flex');
  }

  function openImage(source) {
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.innerHTML = (
      `<button type="button" aria-label="Close image preview">${icon('close')}</button>
      <img decoding="sync" loading="lazy" alt="Image attachment preview">`
    );
    viewer.querySelector('img').src = source;
    const close = () => viewer.remove();
    viewer.addEventListener('click', close);
    viewer.querySelector('img').addEventListener('click', (event) => event.stopPropagation());
    viewer.querySelector('button').addEventListener('click', close);
    document.body.append(viewer);
  }

  fileInput.addEventListener('click', (event) => {
    if (submitting) { event.preventDefault(); }
  });
  fileInput.addEventListener('change', () => {
    clearError();
    const [file] = fileInput.files;
    if (!file) {
      clearAttachment();
      return;
    }
    if (file.size > UPLOAD_FILE_MAX_SIZE) {
      clearAttachment();
      showError('The selected image is larger than 2 MB.');
      return;
    }
    previewUrl = URL.createObjectURL(file);
    attachmentPreview.src = previewUrl;
    attachmentName.textContent = file.name || 'Image selected';
    attachment.classList.remove('hidden');
    attachment.classList.add('flex');
  });

  removeAttachment.addEventListener('click', clearAttachment);

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin
      || event.source !== messagesFrame.contentWindow
      || event.data?.type !== 'openshop:view-image'
      || typeof event.data.source !== 'string') return;
    openImage(event.data.source);
  });

  form.addEventListener('submit', async (event) => {
    clearError();
    if (!messageInput.value.trim() && !fileInput.files.length) {
      showError('Write a message or choose an image.');
      event.preventDefault();
      return;
    }

    sendButton.disabled = true;
    sendButton.textContent = '…';
    fileInput.classList.add('disabled');
    submitting = true;
  });
})();
