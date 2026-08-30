import { escapeAttribute, escapeHtml } from '../utils/html.js';
import { icon } from './layout.js';
import { renderBbcode } from '../utils/bbcode.js';

export const richText = (description) => (
  `<div class="rich-text">${renderBbcode(description)}</div>`
);

export const richEditor = ({
  value = '',
  label = 'Description',
  name = 'description',
}) => (
  `<div data-rich-editor>
    <div class="mb-2 flex items-center justify-between">
      <span
        class="text-[12px] font-semibold uppercase tracking-wide text-muted"
      >${escapeHtml(label)}</span>
      <div class="flex items-center gap-1 rounded-xl bg-surface-2 p-1 border border-border">
        <button
          type="button"
          data-tab="write"
          class="rich-tab active rounded-lg px-3 py-1.5 text-[13px] font-semibold text-text transition-colors"
        >
          ${icon('pencil', 'size-3.5')}
          <span>Write</span>
        </button>

        <button
          type="button"
          data-tab="preview"
          class="rich-tab rounded-lg px-3 py-1.5 text-[13px] font-semibold text-muted hover:text-text transition-colors"
        >
          ${icon('eye', 'size-3.5')}
          <span>Preview</span>
        </button>
      </div>
    </div>
    <div
      class="overflow-hidden rounded-xl border border-border bg-surface-2 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30"
    >
      <div
        data-editor-toolbar
        class="rich-toolbar flex items-center gap-1 border-b border-border p-1.5"
        aria-label="Text formatting"
      >
        <button
          type="button"
          data-bbcode="b"
          title="Bold"
          aria-label="Bold"
        >${icon('bold', 'size-4')}</button>
        <button
          type="button"
          data-bbcode="i"
          title="Italic"
          aria-label="Italic"
        >${icon('italic', 'size-4')}</button>
        <button
          type="button"
          data-bbcode="img"
          title="Image"
          aria-label="Image"
        >${icon('image', 'size-4')}</button>
        <button
          type="button"
          data-bbcode="quote"
          title="Quote"
        >Quote</button>
      </div>
      <div data-pane="write">
        <textarea
          rows="6"
          class="w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed text-text placeholder:text-faint outline-none"
          name="${escapeAttribute(name)}"
          placeholder="Describe it…"
        >${escapeHtml(value)}</textarea>
      </div>
      <div
        data-pane="preview"
        class="hidden min-h-[160px] px-4 py-3"
      >
        <div data-rich-preview class="rich-text"></div>
      </div>
    </div>
    <span
      class="mt-1.5 block text-[12px] text-faint"
    >Insert images with paste or drop</span>
  </div>`
);
