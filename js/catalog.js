const tabsSwiper = new Swiper('#catalog__navigation-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 20,
  initialSlide: 0,

  navigation: {
    nextEl: '.catalog__navigation-button_next',
    prevEl: '.catalog__navigation-button_prev',
  },

  breakpoints: {
    992: {
      allowTouchMove: false,
      freeMode: false,
    },
  },
});

//filterModal
const filterButton = document.querySelector('.catalog__filter-button');
const filter = document.querySelector('.catalog__filter');

filterButton?.addEventListener('click', () => {
  document.body.classList.add('filter-open');
});

document.addEventListener('click', (e) => {
  if (
    document.body.classList.contains('filter-open') &&
    !filter.contains(e.target) &&
    !e.target.closest('.catalog__filter-button')
  ) {
    document.body.classList.remove('filter-open');
  }

  if (
    document.body.classList.contains('filter-open') &&
    e.target === filter &&
    e.offsetX > filter.offsetWidth - 50 &&
    e.offsetY < 50
  ) {
    document.body.classList.remove('filter-open');
  }
});
