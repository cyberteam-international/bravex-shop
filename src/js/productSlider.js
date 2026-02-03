document.addEventListener("DOMContentLoaded", () => {
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

  // Сохраняем в глобальные переменные для обновления
  window.productThumbsSwiper = thumbsSlider;
  window.productMainSwiper = mainSlider;
});
