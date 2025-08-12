const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const mainSwiper = new Swiper('.main-swiper__inner .swiper', {
  spaceBetween: 30,
  effect: 'fade',
  centeredSlides: true,
  speed: 1000,
  loop: true,
  allowTouchMove: false,
  pagination: {
    el: '.main-swiper__pagination',
    clickable: true,
    bulletClass: 'main-swiper__pagination-bullet',
    bulletActiveClass: 'is-active',
    renderBullet: function (index, className) {
      return `
      <div class="${className}" data-index="${index}">${['수소 인프라', 'LNG 인프라', 'LPG 인프라'][index]}</div>
      `;
    },
  },
  on: {
    init: function () {
      // Initialize active state on first load
      const bullets = document.querySelectorAll('.main-swiper__pagination-bullet');
      if (bullets.length > 0) {
        bullets[0].classList.add('is-active');
      }
    },
    slideChange: function () {
      const bullets = document.querySelectorAll('.main-swiper__pagination-bullet');
      const activeIndex = this.realIndex % bullets.length; // Handle loop mode

      // Remove active class from all bullets
      bullets.forEach((bullet) => {
        bullet.classList.remove('is-active');
      });

      // Add active class to current bullet
      if (bullets[activeIndex]) {
        bullets[activeIndex].classList.add('is-active');
      }
    },
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
});
const librarySwiper = new Swiper('.main-library__gallery .swiper', {
  slidesPerView: 'auto',
  loop: true,
  spaceBetween: 100,
  speed: 1000,
});
const mediaSwiper = new Swiper('.main-media__swiper', {
  slidesPerView: 'auto',
  spaceBetween: 40,
  speed: 1000,
  pagination: {
    el: '.main-media__pagination',
    type: 'progressbar',
  },
});

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  animateUp('.up', 50, {
    threshold: 1,
  });
  animateUp('.main-sustainability__feature', 500, {
    threshold: 0.4,
  });
  animateUp('.section-header', 500, {
    threshold: 0.2,
  });
});
