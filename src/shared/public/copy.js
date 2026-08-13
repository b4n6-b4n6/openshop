/* global document, alert */
(() => {
  let feedbackTimer;

  function showFeedback(message, failed = false) {
    let feedback = document.querySelector('[data-copy-feedback]');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.dataset.copyFeedback = '';
      feedback.className = 'copy-feedback';
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');
      document.body.append(feedback);
    }
    feedback.textContent = message;
    feedback.classList.toggle('copy-feedback-error', failed);
    feedback.classList.add('copy-feedback-visible');
    globalThis.clearTimeout(feedbackTimer);
    feedbackTimer = globalThis.setTimeout(() => {
      feedback.classList.remove('copy-feedback-visible');
    }, 1800);
  }

  document.querySelectorAll('[data-copy]').forEach((control) => {
    control.addEventListener('click', async () => {
      const original = control.getAttribute('aria-label');
      try {
        await navigator.clipboard.writeText(control.dataset.copy);
        control.setAttribute('aria-label', 'Copied to clipboard');
        control.classList.add('text-success');
        showFeedback('Copied to clipboard');
      } catch (error) {
        console.error('Could not copy to clipboard', error);
        control.setAttribute('aria-label', 'Copy failed');
        control.classList.add('text-danger');
        showFeedback('Could not copy to clipboard', true);
        alert(`Here you go! ${control.dataset.copy}`);
      }
      globalThis.setTimeout(() => {
        control.setAttribute('aria-label', original);
        control.classList.remove('text-success', 'text-danger');
      }, 1800);
    });
  });
})();
