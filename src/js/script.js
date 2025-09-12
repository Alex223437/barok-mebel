
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