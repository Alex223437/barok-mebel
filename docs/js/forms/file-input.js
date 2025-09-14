export function initFileInput(rootSel = '.calculation__file'){
  const root = document.querySelector(rootSel);
  if (!root) return;
  const input = root.querySelector('input[type="file"]');
  const info  = root.querySelector('.calculation__file-info');
  if (!input || !info) return;

  const placeholder = `максимальный размер 100 МБ<br>допустимые типы файлов: jpg, pdf`;
  const render = () => {
    if (input.files && input.files.length) {
      info.innerHTML = `<span class="calculation__file-name">${input.files[0].name}</span>`;
    } else {
      info.innerHTML = placeholder;
    }
  };
  input.addEventListener('change', render);
  render();
}