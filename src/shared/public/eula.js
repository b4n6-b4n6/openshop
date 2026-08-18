/* global document */
(() => {
  const COOKIE_NAME = 'openshop_eula_accepted';

  function hasAcceptedEula() {
    try {
      return localStorage.getItem(COOKIE_NAME) === '1' || document.cookie.indexOf(`${COOKIE_NAME}=1`) !== -1;
    } catch {
      return document.cookie.indexOf(`${COOKIE_NAME}=1`) !== -1;
    }
  }

  function setEulaCookie(name, val, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${val}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
  }

  function acceptEula() {
    try {
      localStorage.setItem(COOKIE_NAME, '1');
    } catch {
      // Ignore localStorage availability errors
    }
    setEulaCookie(COOKIE_NAME, '1');
  }

  function initEula() {
    const eulaOverlay = document.getElementById('eulaOverlay');
    const eulaCheckbox = document.getElementById('eulaCheckbox');
    const btnAcceptEula = document.getElementById('btnAcceptEula');

    if (!eulaOverlay) return;

    if (hasAcceptedEula()) {
      document.documentElement.classList.remove('eula-pending');
      document.documentElement.classList.add('eula-accepted');
      return;
    }

    document.documentElement.classList.add('eula-pending');
    document.documentElement.classList.remove('eula-accepted');

    if (eulaCheckbox && btnAcceptEula) {
      eulaCheckbox.addEventListener('change', () => {
        btnAcceptEula.disabled = !eulaCheckbox.checked;
      });

      btnAcceptEula.addEventListener('click', () => {
        acceptEula();
        eulaOverlay.classList.add('closing');
        globalThis.setTimeout(() => {
          document.documentElement.classList.remove('eula-pending');
          document.documentElement.classList.add('eula-accepted');
        }, 350);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEula);
  } else {
    initEula();
  }
})();
