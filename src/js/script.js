document.addEventListener("DOMContentLoaded", () => {
  // Dropdown functionality for header
  const parentItem = document.querySelector('.header__item-parent');
  const dropdown = parentItem.querySelector('.header__dropdown');

  function showDropdown() {
    dropdown.classList.add('is-open');
  }

  function hideDropdown() {
    dropdown.classList.remove('is-open');
  }

  parentItem.addEventListener('mouseenter', showDropdown);
  parentItem.addEventListener('mouseleave', hideDropdown);
});
