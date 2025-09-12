
const BAD_WS   = /[\u00ad\u200b\u200c\u200d\u2028\u2029\u2060\uFEFF]/gu;
const MULTI_WS = /\s{2,}/g;
const GLUE_WORDS = [
  'и','а','но',
  'в','к','с','у','о',
  'от','по','на','за','из','без','для',
  'над','под','при','об','обо','со','ко'
];
const GLUE_RE = new RegExp(`(^|\\s)(${GLUE_WORDS.join('|')})\\s+(?=\\S)`, 'giu');

function fixTextNode(node) {
  let t = node.nodeValue;
  t = t.replace(BAD_WS, ' ').replace(MULTI_WS, ' ');
  t = t.replace(/\s*\n+\s*/g, ' ');
  t = t.replace(GLUE_RE, (_m, lead, w) => (lead ? ' ' : '') + w + '\u00A0');
  node.nodeValue = t;
}

function walk(root = document) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentNode?.nodeName || '';
        return /^(SCRIPT|STYLE|CODE|PRE)$/i.test(p)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  for (let n; (n = walker.nextNode()); ) fixTextNode(n);
}

document.addEventListener('DOMContentLoaded', () => walk());

new MutationObserver(muts => {
  for (const m of muts) {
    m.addedNodes.forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        fixTextNode(n);
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        walk(n);
      }
    });
  }
}).observe(document.documentElement, { childList: true, subtree: true });

const HERO_SLIDES = [
  'img/hero/slide-1.jpg',
  'img/hero/slide-2.jpg',
  'img/hero/slide-3.jpg',
];
const AUTOPLAY_MS = 8000;
const FADE_MS = 700; // должен совпадать с CSS .7s

// ====== рендер ======
const stack = document.getElementById('heroBg');
const bulletsWrap = document.getElementById('heroBullets');

let idx = 0;
let timer = null;
let slides = [];
let bullets = [];

function createSlide(url, i){
  const el = document.createElement('div');
  el.className = 'hero-bg-slide';
  el.style.backgroundImage = `url("${url}")`;
  el.setAttribute('role','img');
  el.setAttribute('aria-label', `Фон слайд ${i+1}`);
  return el;
}
function createBullet(i){
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('aria-label', `Перейти к слайду ${i+1}`);
  b.addEventListener('click', () => goTo(i, true));
  return b;
}

function render(){
  HERO_SLIDES.forEach((url, i) => {
    const s = createSlide(url, i);
    stack.appendChild(s);
    slides.push(s);

    const b = createBullet(i);
    bulletsWrap.appendChild(b);
    bullets.push(b);
  });
}

// ====== смена слайда ======
let animating = false;
function goTo(next, user=false){
  if (animating || next === idx) return;
  animating = true;

  const cur = idx;
  idx = (next + slides.length) % slides.length;

  slides[cur].classList.remove('is-active');
  slides[idx].classList.add('is-active');

  bullets[cur].classList.remove('is-active');
  bullets[idx].classList.add('is-active');

  if (user) restartAutoplay();

  setTimeout(() => { animating = false; }, FADE_MS);
}
function next(){ goTo(idx + 1); }

// ====== автоплей ======
function startAutoplay(){
  stopAutoplay();
  timer = setInterval(next, AUTOPLAY_MS);
}
function stopAutoplay(){
  if (timer){ clearInterval(timer); timer = null; }
}
function restartAutoplay(){
  stopAutoplay();
  startAutoplay();
}

// const heroEl = document.querySelector('.hero');
// heroEl.addEventListener('mouseenter', stopAutoplay);
// heroEl.addEventListener('mouseleave', startAutoplay);

// ====== предзагрузка и инициализация ======
function preload(url){ return new Promise(res => { const i=new Image(); i.onload=i.onerror=()=>res(); i.src=url; }); }

(async function initHeroBackground(){
  if (!HERO_SLIDES.length) return;

  render();

  await Promise.all(HERO_SLIDES.map(preload));

  slides[0].classList.add('is-active');
  bullets[0].classList.add('is-active');

  // старт
  startAutoplay();

  // ресайз — ничего особого, но если нужно можно тут что-то адаптивное
  window.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay(); else startAutoplay();
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('partnersMarquee');
  if (!track) return;

  // 1) сохраним исходные элементы (один набор)
  const base = Array.from(track.children);

  // 2) клонируем набор хотя бы один раз (итого — два набора подряд)
  function appendSet(){
    base.forEach(node => track.appendChild(node.cloneNode(true)));
  }
  appendSet();

  // 3) если ширина двух наборов всё ещё меньше ширины контейнера,
  //    докидываем до тех пор, пока трек не станет шире в 2× контейнера.
  const wrap = track.parentElement;
  function ensureWidth(){
    const need = wrap.clientWidth * 2;
    while (track.scrollWidth < need) appendSet();
  }
  ensureWidth();

  // 4) при ресайзе перепроверяем (на всякий, редкий кейс)
  let to = null;
  window.addEventListener('resize', () => {
    clearTimeout(to);
    to = setTimeout(ensureWidth, 150);
  }, { passive: true });
});

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.querySelector('.calculation__file input[type="file"]');
  const fileInfo = document.querySelector('.calculation__file-info');

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      fileInfo.innerHTML = `<span class="calculation__file-name">${fileName}</span>`;
    } else {
      fileInfo.innerHTML = `максимальный размер 100 МБ<br>допустимые типы файлов: jpg, pdf`;
    }
  });
});