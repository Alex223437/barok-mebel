const AUTOPLAY_MS = 8000;
const FADE_MS = 700; // синхронизирован с CSS

export function initHeroSlider({
  slides = [],             // массив путей
  stackSel = '#heroBg',    // контейнер слайдов
  bulletsSel = '#heroBullets'
} = {}) {
  if (!slides.length) return;

  const stack = document.querySelector(stackSel);
  const bulletsWrap = document.querySelector(bulletsSel);
  if (!stack || !bulletsWrap) return;

  let idx = 0, anim = false, timer = null;
  const slideEls = [], bulletEls = [];

  const mkSlide = (url, i) => {
    const el = document.createElement('div');
    el.className = 'hero-bg-slide';
    el.style.backgroundImage = `url("${url}")`;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `Фон слайд ${i+1}`);
    return el;
  };
  const mkBullet = (i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Перейти к слайду ${i+1}`);
    b.addEventListener('click', () => goTo(i, true));
    return b;
  };

  slides.forEach((url, i) => {
    const s = mkSlide(url, i); stack.appendChild(s); slideEls.push(s);
    const b = mkBullet(i);     bulletsWrap.appendChild(b); bulletEls.push(b);
  });

  const goTo = (next, user = false) => {
    if (anim || next === idx) return;
    anim = true;
    const cur = idx;
    idx = (next + slideEls.length) % slideEls.length;
    slideEls[cur].classList.remove('is-active');
    slideEls[idx].classList.add('is-active');
    bulletEls[cur].classList.remove('is-active');
    bulletEls[idx].classList.add('is-active');
    if (user) restart();
    setTimeout(() => (anim = false), FADE_MS);
  };
  const next = () => goTo(idx + 1);

  const start = () => { stop(); timer = setInterval(next, AUTOPLAY_MS); };
  const stop  = () => { if (timer) clearInterval(timer), (timer = null); };
  const restart = () => { stop(); start(); };

  // предзагрузка
  Promise.all(slides.map(url => new Promise(r => { const img = new Image(); img.onload = img.onerror = r; img.src = url; })))
    .then(() => {
      slideEls[0].classList.add('is-active');
      bulletEls[0].classList.add('is-active');
      start();
      document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    });
}