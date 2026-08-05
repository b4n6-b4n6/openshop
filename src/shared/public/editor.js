/* global document */
(() => {
  document.querySelectorAll('[data-rich-editor]').forEach((editor) => {
    const textarea = editor.querySelector('textarea');

    function insert(tag) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.slice(start, end);
      const replacement = `[${tag}]${selected}[/${tag}]`;
      textarea.setRangeText(replacement, start, end, 'select');
      textarea.focus();
      textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2);
    }

    editor.querySelectorAll('[data-bbcode]').forEach((control) => {
      control.addEventListener('click', () => insert(control.dataset.bbcode));
    });
  });
})();
