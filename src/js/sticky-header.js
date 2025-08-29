document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');

  const checkScroll = () => {
    header.classList.toggle('header--sticky', window.scrollY > 10);
  };

  checkScroll();

  window.addEventListener('scroll', checkScroll);
});
