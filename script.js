// preloader

// document.body.style.overflow = 'hidden';
// const loader = () => {
//     document.body.style.overflow = '';
//     const preloader = document.getElementById('preloader');
//     const fadeout = setInterval(() => {
//         const opacity = getComputedStyle(preloader).opacity;
//         opacity > 0 ? preloader.style.opacity = opacity - 0.1000 : (clearInterval(fadeout), preloader.remove());
//     }, 15);
// }


// setTimeout(() => loader(), 2000);

if (window.scrollY > 0) {
    window.scrollTo(0, 0); // Сбросить прокрутку в начало при загрузке
  }


  const classesToExclude = [
  ];

  function getCurrentScale() {
      const body = document.body;
      const transform = window.getComputedStyle(body).transform;
      if (transform && transform !== 'none') {
          const matrix = transform.match(/matrix\(([^)]+)\)/);
          if (matrix) {
              const values = matrix[1].split(',');
              return parseFloat(values[0]) || 1;
          }
      }
      return 1;
  }

  // Переменная для отслеживания текущего масштаба
  let currentScale = getCurrentScale();

  // Инициализация Lenis с обновленными настройками
  const lenis = new Lenis({
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: true,
      autoResize: true,
      syncTouch: false,

      // Функция предотвращения скролла для определенных элементов
      prevent: (node) => {
          return classesToExclude.some(className =>
              node.classList.contains(className) ||
              node.closest(`.${className}`)
          );
      },

      // Виртуальный скролл для обработки автоскейла
      virtualScroll: (e) => {
          const newScale = getCurrentScale();

          if (newScale !== currentScale) {
              currentScale = newScale;
          }

          if (currentScale !== 1) {
              e.deltaY = e.deltaY / currentScale;
              e.deltaX = e.deltaX / currentScale;
          }

          return true;
      }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
          currentScale = getCurrentScale();
          lenis.resize(); // Обновляем размеры Lenis
      }, 100);
  });


  window.addEventListener('load', () => {
      classesToExclude.forEach((className) => {
          document.querySelectorAll(`.${className}`).forEach((element) => {
              element.setAttribute('data-lenis-prevent', '');
          });
      });
  });


  lenis.on('scroll', (e) => {
      // console.log('Scroll event:', e);
  });




 // popup



// showreel slider
const showreelSlider = new Swiper('#showreel-slider', {
    direction: 'horizontal',
    centeredSlides: true,
    initialSlide: 1,
    // loop: true,
    navigation: {
      nextEl: '.showreel-button-next',
      prevEl: '.showreel-button-prev',
    },

    slidesPerView: 1.2,
    spaceBetween: 6,
    speed: 500,

    breakpoints: {

        1000: {
          slidesPerView: 1.7,
          spaceBetween: 14
        },
    },



    simulateTouch: true,
    allowTouchMove: true,
  });



// burger-menu

// const burgerBtn = document.querySelector('.burger-btn');
// const menu = document.querySelector('.menu');
// const closeBtn = document.querySelector('.close-btn');
// const body = document.body;
// const menuLinks = document.querySelectorAll('.burger__list-link a');

// burgerBtn.addEventListener('click', () => {
//     menu.classList.add('active');
//     body.classList.add('menu-open');
// });

// closeBtn.addEventListener('click', () => {
//     menu.classList.remove('active');
//     body.classList.remove('menu-open');
// });

// menuLinks.forEach(link => {
//     link.addEventListener('click', () => {
//         menu.classList.remove('active');
//         body.classList.remove('menu-open');
//     });
// });







//Fade-in

gsap.utils.toArray(".fade-in").forEach((element) => {
    gsap.from(element, {
        opacity: 0,
        y: 40,
        duration: 1,
        scrollTrigger: {
        trigger: element,
        start: "top 90%",
        toggleActions: "play none none none",
        },
    });
});





window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });




//costumers gallery
const blocks = document.querySelectorAll('.costumers__block');

blocks.forEach(block => {
  block.addEventListener('mouseenter', () => {
    blocks.forEach(b => b.classList.remove('active'));
    block.classList.add('active');
  });
});