// дублируем партнёров до 2× ширины контейнера
export function initMarquee(trackSel = '#partnersMarquee'){
  const track = document.querySelector(trackSel);
  if (!track) return;
  const wrap = track.parentElement;
  const base = Array.from(track.children);

  const appendSet = () => base.forEach(n => track.appendChild(n.cloneNode(true)));
  appendSet();

  const ensureWidth = () => {
    const need = wrap.clientWidth * 2;
    while (track.scrollWidth < need) appendSet();
  };
  ensureWidth();

  let to = null;
  window.addEventListener('resize', () => { clearTimeout(to); to = setTimeout(ensureWidth, 150); }, { passive: true });
}