export function initMobileMenu(){
  const menu    = document.querySelector('.header__menu');
  const burger  = document.querySelector('.header__burger');
  const close   = document.querySelector('.header__close');
  const overlay = document.querySelector('.header__overlay');
  if (!menu || !burger || !overlay) return;

  const lock   = () => { document.documentElement.classList.add('no-scroll'); document.body.classList.add('no-scroll'); };
  const unlock = () => { document.documentElement.classList.remove('no-scroll'); document.body.classList.remove('no-scroll'); };

  const openMenu  = () => { menu.classList.add('active'); overlay.classList.add('active'); lock(); };
  const closeMenu = () => { menu.classList.remove('active'); overlay.classList.remove('active'); unlock(); };

  burger.addEventListener('click', openMenu);
  close?.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  menu.querySelectorAll('.header__menu-link').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => (e.key === 'Escape') && closeMenu());

  // автозакрытие при переходе на десктоп
  const mq = window.matchMedia('(min-width: 769px)');
  mq.addEventListener?.('change', e => { if (e.matches) closeMenu(); });
}