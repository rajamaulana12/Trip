export function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
  el.setAttribute('aria-hidden', 'false');
}

export function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('show');
  el.setAttribute('aria-hidden', 'true');
}

export function initModalHandlers() {
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      if (targetId) closeModal(targetId);
    });
  });

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal.show').forEach((modal) => {
      closeModal(modal.id);
    });
    const authModal = document.getElementById('userLogin');
    if (authModal?.classList.contains('show')) {
      authModal.classList.remove('show');
      authModal.setAttribute('aria-hidden', 'true');
    }
  });
}
