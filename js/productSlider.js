const thumbsSlider = new Swiper('.product__thumbs-slider', {
  slidesPerView: 'auto',
  spaceBetween: 11,
  watchSlidesProgress: true,
  freeMode: true,
});

const mainSlider = new Swiper('.product__main-slider', {
  slidesPerView: 1,
  spaceBetween: 0,
  thumbs: {
    swiper: thumbsSlider,
  },
});
