import { renderBbcode } from './bbcode.js';

test('renders supported BBCode formatting', () => {
  expect(renderBbcode('[b]Bold[/b] [i]italic[/i]')).toBe(
    '<strong>Bold</strong> <em>italic</em>',
  );
  expect(renderBbcode('[quote]Hello[/quote]')).toBe(
    '<blockquote>Hello</blockquote>',
  );
});

test('escapes HTML and rejects unsafe links', () => {
  const result = renderBbcode(
    '<script>alert(1)</script> [url=javascript:alert(1)]click[/url]',
  );

  expect(result).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  expect(result).not.toContain('<script>');
  expect(result).not.toContain('href="javascript:');
});

test('renders only safe embedded data images', () => {
  const safe = 'data:image/png;base64,AAAA';

  expect(renderBbcode(`[img]${safe}[/img]`)).toContain(`src="${safe}"`);
  expect(renderBbcode('[img]javascript:alert(1)[/img]')).not.toContain('<img');
});
