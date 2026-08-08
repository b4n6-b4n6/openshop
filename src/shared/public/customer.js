/* global document */
(() => {
  document.querySelectorAll('[data-copy]').forEach((control) => {
    control.addEventListener('click', async () => {
      const original = control.getAttribute('aria-label');
      try {
        await navigator.clipboard.writeText(control.dataset.copy);
        control.setAttribute('aria-label', 'Copied');
        control.classList.add('text-success');
      } catch (error) {
        console.error('Could not copy shop address', error);
        control.setAttribute('aria-label', 'Copy failed');
        control.classList.add('text-danger');
      }
      globalThis.setTimeout(() => {
        control.setAttribute('aria-label', original);
        control.classList.remove('text-success', 'text-danger');
      }, 1800);
    });
  });

  document.querySelectorAll('[data-purchase-form]').forEach((form) => {
    const input = form.querySelector('[data-purchase-quantity]');
    const decrease = form.querySelector('[data-quantity-decrease]');
    const increase = form.querySelector('[data-quantity-increase]');
    const submit = document.querySelector(`[form="${form.id}"]`);
    if (!input || !decrease || !increase || !submit) return;
    const min = Number(input.min);
    const max = Number(input.max);
    const price = Number(form.dataset.unitPrice);
    const currency = form.dataset.currency.toUpperCase();

    const update = () => {
      const value = Math.max(min, Math.min(max, Number(input.value) || min));
      input.value = value;
      decrease.disabled = value <= min;
      increase.disabled = value >= max;
      submit.textContent = `Purchase · ${new Intl.NumberFormat('en', {
        currency,
        maximumFractionDigits: 2,
        style: 'currency',
      }).format(price * value)}`;
    };

    decrease.addEventListener('click', () => {
      input.stepDown();
      update();
    });
    increase.addEventListener('click', () => {
      input.stepUp();
      update();
    });
    input.addEventListener('change', update);
    form.addEventListener('submit', () => {
      submit.disabled = true;
      submit.textContent = 'Placing order…';
    });
    update();
  });
})();
