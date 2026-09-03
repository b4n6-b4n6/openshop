import {
  icon,
} from './layout.js';
import { escapeAttribute, escapeHtml } from '../utils/html.js';

export default (order) => (
  order.deposit_txid
    ? (
      `<div
        class="rounded-xl border border-border bg-surface p-4"
      >
        <p
          class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted"
        >Deposit txid</p>

        <div class="flex items-start gap-2">
          <span
            class="min-w-0 flex-1 break-all font-mono text-[11px] text-text"
          >${escapeHtml(order.deposit_txid)}</span>

          <button
            type="button"
            data-copy="${escapeAttribute(order.deposit_txid)}"
            aria-label="Copy transaction ID"
            class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface hover:text-text"
          >
            ${icon('copy', 'size-4')}
          </button>
        </div>
      </div>`
    )
    : ''
);
