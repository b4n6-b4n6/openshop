/* global DataTransfer, document */
(() => {
  const editor = document.querySelector('[data-rich-editor]');
  if (!editor) return;

  const textarea = editor.querySelector('textarea');
  const files = editor.querySelector('[data-inline-images]');
  const selected = new DataTransfer();

  function insert(open, close = open) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.slice(0, start);
    const middle = textarea.value.slice(start, end);
    const after = textarea.value.slice(end);
    textarea.value = `${before}[${open}]${middle}[/${close}]${after}`;
    textarea.focus();
    textarea.setSelectionRange(start + open.length + 2, end + open.length + 2);
  }

  editor.querySelectorAll('[data-bbcode]').forEach((button) => {
    button.addEventListener('click', () => insert(button.dataset.bbcode));
  });

  editor.querySelector('[data-add-image]')?.addEventListener('click', () => files.click());
  function addImages(images) {
    const offset = selected.files.length;
    Array.from(images).forEach((file) => {
      if (file.type.startsWith('image/') && selected.files.length < 5) {
        selected.items.add(file);
      }
    });
    files.files = selected.files;

    const tokens = Array.from(files.files)
      .slice(offset)
      .map((_, index) => `[image:${offset + index}]`)
      .join('\n');
    const position = textarea.selectionStart;
    textarea.setRangeText(tokens, position, textarea.selectionEnd, 'end');
    textarea.focus();
  }

  files.addEventListener('change', () => {
    addImages(files.files);
  });

  textarea.addEventListener('paste', (event) => {
    const images = Array.from(event.clipboardData?.files ?? [])
      .filter((file) => file.type.startsWith('image/'));
    if (images.length === 0) return;
    event.preventDefault();
    addImages(images);
  });
})();
