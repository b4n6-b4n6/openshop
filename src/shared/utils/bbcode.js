/* eslint-disable no-continue, import/prefer-default-export */
import { escapeAttribute, escapeHtml } from './html.js';
import {
  isSafeDataImage,
  MAX_RICH_DESCRIPTION_BYTES,
} from './uploads.js';

const TAGS = {
  b: ['strong', 'strong'],
  h1: ['h2', 'h2'],
  h2: ['h3', 'h3'],
  i: ['em', 'em'],
  li: ['li', 'li'],
  ol: ['ol', 'ol'],
  quote: ['blockquote', 'blockquote'],
  s: ['s', 's'],
  u: ['u', 'u'],
  ul: ['ul', 'ul'],
};

const TOKEN = /\[(\/?)(b|h1|h2|i|li|ol|quote|s|u|ul|url)(?:=([^\]]+))?\]/gi;

const safeHref = (value) => {
  const href = String(value ?? '').trim();
  if (/^(?:https?:\/\/|\/(?!\/)|#)/i.test(href)) {
    return href;
  }
  return null;
};

const escapedText = (value) => escapeHtml(value).replaceAll('\n', '<br>\n');

const renderSpecialBlock = (source, offset) => {
  const remaining = source.slice(offset);
  const open = /^\[(code|img)\]/i.exec(remaining);
  if (!open) { return null; }

  const tag = open[1].toLowerCase();
  const close = new RegExp(`\\[/${tag}\\]`, 'i');
  const tail = remaining.slice(open[0].length);
  const closing = close.exec(tail);
  if (!closing) { return null; }

  const raw = tail.slice(0, closing.index);
  const consumed = open[0].length + closing.index + closing[0].length;

  if (tag === 'code') {
    return {
      consumed,
      html: `<pre><code>${escapeHtml(raw)}</code></pre>`,
    };
  }

  const src = raw.trim();
  return {
    consumed,
    html: isSafeDataImage(src)
      ? `<img src="${escapeAttribute(src)}" alt="" loading="lazy">`
      : escapedText(remaining.slice(0, consumed)),
  };
};

export const renderBbcode = (value = '') => {
  const source = String(value);
  if (Buffer.byteLength(source, 'utf8') > MAX_RICH_DESCRIPTION_BYTES) {
    return '<p class="rich-error">Description is too large to display.</p>';
  }

  const stack = [];
  let html = '';
  let cursor = 0;

  while (cursor < source.length) {
    const special = renderSpecialBlock(source, cursor);
    if (special) {
      html += special.html;
      cursor += special.consumed;
      continue;
    }

    TOKEN.lastIndex = cursor;
    const token = TOKEN.exec(source);
    if (!token || token.index !== cursor) {
      const nextBracket = source.indexOf('[', cursor + 1);
      const end = nextBracket === -1 ? source.length : nextBracket;
      html += escapedText(source.slice(cursor, end));
      cursor = end;
      continue;
    }

    const [literal, closing, rawTag, argument] = token;
    const tag = rawTag.toLowerCase();
    cursor += literal.length;

    if (closing) {
      if (stack.at(-1)?.tag !== tag) {
        html += escapeHtml(literal);
        continue;
      }
      const frame = stack.pop();
      html += frame.close;
      continue;
    }

    if (tag === 'url') {
      const href = safeHref(argument);
      if (!href) {
        html += escapeHtml(literal);
        continue;
      }
      const close = '</a>';
      html += `<a href="${escapeAttribute(href)}" rel="noreferrer noopener">`;
      stack.push({ tag, close });
      continue;
    }

    if (argument !== undefined) {
      html += escapeHtml(literal);
      continue;
    }

    const [openElement, closeElement] = TAGS[tag];
    html += `<${openElement}>`;
    stack.push({ tag, close: `</${closeElement}>` });
  }

  while (stack.length > 0) {
    html += stack.pop().close;
  }

  return html;
};
