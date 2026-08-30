import { CURRENCIES } from '../../const.js';

export default (value) => (
  `<label class="block">
    <span
      class="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-muted"
    >Currency</span>
    <select
      class="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 text-[15px] text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      name="currency"
      required
    >
      ${CURRENCIES.map((currency) => (
        `<option
          value="${currency}"
          ${currency === String(value).toLowerCase() ? 'selected' : ''}
        >${currency.toUpperCase()}</option>`
      )).join('')}
    </select>
  </label>`
);
