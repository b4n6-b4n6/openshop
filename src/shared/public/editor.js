/* global document, FileReader, window */
(() => {
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
  });

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderBbcode(text, imagesMap = {}) {
    if (!text || !text.trim()) {
      return '<p class="text-faint italic text-[13px]">Nothing to preview</p>';
    }

    const tokens = [];
    let tokenIdx = 0;
    let raw = text;

    raw = raw.replace(/\[code\]([\s\S]*?)\[\/code\]/gi, (_, code) => {
      const key = `___TOKEN_CODE_${tokenIdx++}___`;
      tokens.push({ key, html: `<pre><code>${escapeHtml(code)}</code></pre>` });
      return key;
    });

    raw = raw.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, (_, src) => {
      const key = `___TOKEN_IMG_${tokenIdx++}___`;
      const cleanSrc = src.trim();
      const finalSrc = imagesMap[cleanSrc] || cleanSrc;
      const isData = /^data:image\/(?:gif|jpeg|png|webp);base64,/i.test(finalSrc);
      const isUrl = /^(?:https?:\/\/|\/(?!\/))/i.test(finalSrc);
      let html = escapeHtml(`[img]${src}[/img]`);
      if (isData || isUrl) {
        html = `<img src="${escapeHtml(finalSrc)}" alt="" loading="lazy" class="max-h-80 w-full rounded-xl border border-border my-2 object-contain bg-surface-2">`;
      }
      tokens.push({ key, html });
      return key;
    });

    let html = escapeHtml(raw);

    html = html
      .replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
      .replace(/\[i\]([\s\S]*?)\[\/i\]/gi, 'em>$1</em>')
      .replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>')
      .replace(/\[s\]([\s\S]*?)\[\/s\]/gi, '<s>$1</s>')
      .replace(/\[h1\]([\s\S]*?)\[\/h1\]/gi, '<h2 class="text-lg font-bold text-text my-2">$1</h2>')
      .replace(/\[h2\]([\s\S]*?)\[\/h2\]/gi, '<h3 class="text-base font-semibold text-text my-1">$1</h3>')
      .replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, '<blockquote class="border-l-4 border-accent pl-3 py-1 my-2 text-muted">$1</blockquote>')
      .replace(/\[url=(https?:\/\/[^\]]+)\]([\s\S]*?)\[\/url\]/gi, '<a href="$1" target="_blank" rel="noreferrer noopener" class="text-accent underline">$2</a>')
      .replace(/\[url\](https?:\/\/[^\]]+)\[\/url\]/gi, '<a href="$1" target="_blank" rel="noreferrer noopener" class="text-accent underline">$1</a>');

    html = html.replace(/\n/g, '<br>');

    tokens.forEach(({ key, html: tokenHtml }) => {
      html = html.replace(key, tokenHtml);
    });

    return html;
  }

  document.querySelectorAll('[data-rich-editor]').forEach((editor) => {
    const textarea = editor.querySelector('textarea');
    const toolbar = editor.querySelector('[data-editor-toolbar]');
    const paneWrite = editor.querySelector('[data-pane="write"]');
    const panePreview = editor.querySelector('[data-pane="preview"]');
    const previewContainer = editor.querySelector('[data-rich-preview]');
    const tabs = editor.querySelectorAll('[data-tab]');

    const imagesMap = {};
    let imageCounter = 1;

    if (textarea && textarea.value) {
      textarea.value = textarea.value.replace(/\[img\](data:image\/[a-zA-Z0-9+/=;,-]+)\[\/img\]/gi, (_, dataUrl) => {
        const key = `image${imageCounter}`;
        imageCounter += 1;
        imagesMap[key] = dataUrl;
        return `[img]${key}[/img]`;
      });
    }

    function insertText(text) {
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.setRangeText(text, start, end, 'select');
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function insert(tag) {
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.slice(start, end);
      const replacement = `[${tag}]${selected}[/${tag}]`;
      textarea.setRangeText(replacement, start, end, 'select');
      textarea.focus();
      textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function registerImage(dataUrl, fileName = '') {
      let key = fileName ? fileName.replace(/[^a-zA-Z0-9._-]/g, '_') : '';
      if (!key || imagesMap[key]) {
        key = `image${imageCounter}`;
        imageCounter += 1;
      }
      imagesMap[key] = dataUrl;
      return key;
    }

    function handleImageFile(file) {
      if (!file || !file.type || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const key = registerImage(dataUrl, file.name);
        insertText(`[img]${key}[/img]`);
      };
      reader.readAsDataURL(file);
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        tabs.forEach((t) => {
          t.classList.toggle('active', t === tab);
        });

        if (targetTab === 'preview') {
          if (toolbar) toolbar.classList.add('hidden');
          if (paneWrite) paneWrite.classList.add('hidden');
          if (panePreview) panePreview.classList.remove('hidden');
          if (previewContainer && textarea) {
            previewContainer.innerHTML = renderBbcode(textarea.value, imagesMap);
          }
        } else {
          if (toolbar) toolbar.classList.remove('hidden');
          if (paneWrite) paneWrite.classList.remove('hidden');
          if (panePreview) panePreview.classList.add('hidden');
          if (textarea) textarea.focus();
        }
      });
    });

    editor.querySelectorAll('[data-bbcode]').forEach((control) => {
      control.addEventListener('click', () => insert(control.dataset.bbcode));
    });

    editor.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      editor.classList.add('drag-over');
    });

    editor.addEventListener('dragleave', (e) => {
      if (!editor.contains(e.relatedTarget)) {
        editor.classList.remove('drag-over');
      }
    });

    editor.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      editor.classList.remove('drag-over');

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i += 1) {
          const file = files[i];
          if (file.type && file.type.startsWith('image/')) {
            handleImageFile(file);
            return;
          }
        }
      }

      const items = e.dataTransfer?.items;
      if (items) {
        for (let i = 0; i < items.length; i += 1) {
          const item = items[i];
          if (item.type && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              handleImageFile(file);
              return;
            }
          }
        }
      }
    });

    if (textarea) {
      textarea.addEventListener('paste', (e) => {
        const items = e.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            if (item.type && item.type.startsWith('image/')) {
              const file = item.getAsFile();
              if (file) {
                e.preventDefault();
                handleImageFile(file);
                return;
              }
            }
          }
        }

        const pastedText = e.clipboardData?.getData('text/plain')?.trim();
        if (pastedText && /^data:image\/(?:gif|jpeg|png|webp);base64,[a-z\d+/]+=*$/i.test(pastedText)) {
          e.preventDefault();
          const key = registerImage(pastedText, 'pasted_image.png');
          insertText(`[img]${key}[/img]`);
        }
      });
    }

    const form = editor.closest('form');
    if (form) {
      form.addEventListener('submit', () => {
        if (!textarea) return;
        let val = textarea.value;
        Object.entries(imagesMap).forEach(([key, dataUrl]) => {
          val = val.replaceAll(`[img]${key}[/img]`, `[img]${dataUrl}[/img]`);
        });
        textarea.value = val;
      });
    }
  });
})();
