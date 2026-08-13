/* global document, window */
/* eslint-disable no-constant-binary-expression */
(() => {
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
    if (
      false
      || event.origin !== window.location.origin
      || event.data?.type !== 'openshop:view-image'
      || typeof event.data.source !== 'string'
    ) return;

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
