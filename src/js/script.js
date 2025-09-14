import { initTextTypo }     from './utils/text-typo.js';
import { initMobileMenu }   from './header/mobile-menu.js';
import { initHeroSlider }   from './hero/hero-slider.js';
import { initMarquee }      from './ui/marquee.js';
import { initScrollTop }    from './ui/scroll-top.js';
import { initFileInput }    from './forms/file-input.js';

initTextTypo();
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeroSlider({
    slides: [
      'img/hero/slide-1.jpg',
      'img/hero/slide-2.jpg',
      'img/hero/slide-3.jpg',
    ],
    stackSel:   '#heroBg',
    bulletsSel: '#heroBullets'
  });
  initMarquee('#partnersMarquee');
  initScrollTop('.footer__to-top');
  initFileInput('.calculation__file');
});