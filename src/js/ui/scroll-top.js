export function initScrollTop(btnSel = '.footer__to-top'){
  const btn = document.querySelector(btnSel);
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const toggle = () => btn.style.opacity = window.scrollY > 200 ? '1' : '.6';
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}