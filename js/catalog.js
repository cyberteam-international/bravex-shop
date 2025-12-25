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
