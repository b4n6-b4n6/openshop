const indicators = () => (
`<div
  class="indicators-group flex items-center gap-1.5"
><iframe
  class="wallet-sync-frame"
  src="/self-test"
  title="Shop status"
  loading="eager"
  allowtransparency="true"
></iframe
><iframe
  class="wallet-sync-frame"
  src="/sync-status"
  title="Wallet sync status"
  loading="eager"
  allowtransparency="true"
></iframe
></div>`
);

export default indicators;
