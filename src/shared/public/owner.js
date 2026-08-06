/* global FileReader, DataTransfer, document, window */
(() => {
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
  });

  document.querySelectorAll('[data-photo-field]').forEach((field) => {
    const input = field.querySelector('[data-photo-input]');
    const picker = field.querySelector('[data-photo-pick]');
    const fileName = field.querySelector('[data-photo-name]');

    picker.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      const [file] = input.files;
      if (!file) return;

      fileName.textContent = file.name;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const preview = document.createElement('img');
        preview.dataset.photoPreview = '';
        preview.src = reader.result;
        preview.alt = 'Preview';
        picker.replaceChildren(preview);
      });
      reader.readAsDataURL(file);

      if (field.hasAttribute('data-auto-submit')) {
        picker.disabled = true;
        fileName.textContent = 'Uploading…';
        field.closest('form').requestSubmit();
      }
    });

    const handleFiles = (files) => {
      if (!files || files.length === 0) return;
      const file = Array.from(files).find((f) => f.type && f.type.startsWith('image/'));
      if (!file) return;

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    field.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      field.classList.add('drag-over');
    });

    field.addEventListener('dragleave', (e) => {
      e.preventDefault();
      if (!field.contains(e.relatedTarget)) {
        field.classList.remove('drag-over');
      }
    });

    field.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      field.classList.remove('drag-over');

      if (e.dataTransfer?.files?.length) {
        handleFiles(e.dataTransfer.files);
      } else if (e.dataTransfer?.items?.length) {
        const itemsFiles = [];
        for (let i = 0; i < e.dataTransfer.items.length; i += 1) {
          const item = e.dataTransfer.items[i];
          if (item.kind === 'file') {
            const f = item.getAsFile();
            if (f) itemsFiles.push(f);
          }
        }
        handleFiles(itemsFiles);
      }
    });
  });

  document.querySelectorAll('form[data-disable-on-submit]').forEach((form) => {
    form.addEventListener('submit', () => {
      const external = form.id
        ? document.querySelectorAll(`button[form="${form.id}"]`)
        : [];
      [...form.querySelectorAll('button[type="submit"]'), ...external]
        .forEach((control) => {
          const submitButton = control;
          submitButton.disabled = true;
          submitButton.dataset.originalLabel = submitButton.textContent;
          submitButton.textContent = 'Saving…';
        });
    });
  });

  document.querySelectorAll('[data-copy]').forEach((control) => {
    control.addEventListener('click', async () => {
      const original = control.getAttribute('aria-label');
      try {
        await navigator.clipboard.writeText(control.dataset.copy);
        control.setAttribute('aria-label', 'Copied');
        control.classList.add('text-success');
      } catch (error) {
        console.error('Could not copy shop address', error);
        control.setAttribute('aria-label', 'Copy failed');
        control.classList.add('text-danger');
      }
      globalThis.setTimeout(() => {
        control.setAttribute('aria-label', original);
        control.classList.remove('text-success', 'text-danger');
      }, 1800);
    });
  });

  const closeModal = document.querySelector('[data-close-shop-modal]');
  if (closeModal) {
    const close = () => { closeModal.hidden = true; };
    document.querySelector('[data-close-shop-open]').addEventListener('click', () => {
      closeModal.hidden = false;
    });
    closeModal.querySelector('[data-close-shop-cancel]').addEventListener('click', close);
    closeModal.addEventListener('click', (event) => {
      if (event.target === closeModal) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  }
})();
