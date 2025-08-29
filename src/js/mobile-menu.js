document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.header-nav__toggler');
  const close = document.querySelector('.mobile-menu__close');
  const menu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.overlay');

  const openMenu = () => {
    menu.classList.add('mobile-menu--active');
    overlay.classList.add('overlay--active');
  };

  const closeMenu = () => {
    menu.classList.remove('mobile-menu--active');
    overlay.classList.remove('overlay--active');
  };

  toggle.addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);
  close.addEventListener('click', closeMenu);
});
