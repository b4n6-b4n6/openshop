import { renderBbcode } from './bbcode.js';

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';

test('renders supported BBCode', () => {
  expect(renderBbcode('[b]Bold[/b]\n[i]Italic[/i]')).toBe(
    '<strong>Bold</strong><br>\n<em>Italic</em>',
  );
});

test('escapes HTML and unsafe links', () => {
  expect(renderBbcode('<script>alert(1)</script>')).not.toContain('<script>');
  expect(renderBbcode('[url=javascript:alert(1)]bad[/url]')).not.toContain('href=');
});

test('renders genuine inline data images and rejects spoofed content', () => {
  expect(renderBbcode(`[img]${PNG}[/img]`)).toContain('<img src="data:image/png;base64,');
  expect(renderBbcode('[img]data:image/png;base64,PHN2Zz4=[/img]')).not.toContain('<img');
});

test('does not parse BBCode inside code blocks', () => {
  expect(renderBbcode('[code][b]<x>[/b][/code]')).toBe(
    '<pre><code>[b]&lt;x&gt;[/b]</code></pre>',
  );
});
