import { document } from './layout.js';

export const eulaModal = () => `
<div id="eulaOverlay" class="eula-overlay">
  <form class="eula-modal" method='post' action='/eula'>
    <div class="eula-icon-wrap">
      <div class="eula-icon-glow"></div>
      <svg class="eula-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent, #ff6600)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    </div>

    <h2 class="eula-title">Legal Terms</h2>
    <p class="eula-desc">
      OpenShop is an open-source, self-hosted, peer-to-peer marketplace protocol. You must acknowledge that this software is strictly intended for lawful commerce and research.
    </p>

    <div class="eula-notice-box">
      <div class="eula-notice-item">
        <span class="eula-notice-dot"></span>
        <span>Zero tolerance for illicit trade, contraband, or unlawful conduct.</span>
      </div>
      <div class="eula-notice-item">
        <span class="eula-notice-dot"></span>
        <span>Self-hosted &amp; non-custodial; operators assume full jurisdictional responsibility.</span>
      </div>
    </div>

    <label class="eula-checkbox-label" for="eulaCheckbox">
      <input type="checkbox" id="eulaCheckbox" class="eula-checkbox" required>
      <span class="eula-custom-check"></span>
      <span class="eula-checkbox-text">
        I confirm and agree that <strong>I will only use this software for legal purposes</strong>.
      </span>
    </label>

    <button id="btnAcceptEula" class="eula-btn">
      <span>Acknowledge &amp; Enter</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </button>
  </form>
</div>`;

export const eulaPage = () => document({
  title: 'EULA',
  stylesheets: ['eula.css'],
  body: eulaModal(),
});
