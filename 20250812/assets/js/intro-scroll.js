document.addEventListener('DOMContentLoaded', function () {
  // GSAP와 ScrollTrigger가 로드되었는지 확인
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP 또는 ScrollTrigger가 로드되지 않았습니다.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // brand 섹션 스크롤 애니메이션 초기화
  initBrandScrollAnimation();

  // 모바일 이미지 스와이퍼 초기화
  initMobileImageSwiper();

  function initBrandScrollAnimation() {
    const brandSection = document.querySelector('.intro-section.brand');
    const brandImages = document.querySelector('.brand-images.is-pc');
    const imgTextContent = document.querySelector('.img-text__text');

    if (!brandSection || !brandImages) {
      return;
    }

    // img-text__text는 완전히 고정 - 어떤 애니메이션도 적용하지 않음
    if (imgTextContent) {
      gsap.set(imgTextContent, {
        clearProps: 'all', // 모든 GSAP 속성 제거
      });
    }

    const imageElements = brandImages.querySelectorAll('.brand-images__img');

    if (imageElements.length === 0) {
      return;
    }

    // 이미지들의 초기 상태는 그대로 유지 (fadein, scale 제거)
    // 원래 CSS 상태 그대로 사용

    // 추가 시각적 효과 - 이미지들만 미세한 움직임
    ScrollTrigger.create({
      trigger: brandSection,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => {
        const progress = self.progress;

        imageElements.forEach((img, index) => {
          const offset = Math.sin(progress * Math.PI + index) * 10;
          gsap.set(img, {
            x: offset,
          });
        });
      },
    });
  }

  function initMobileImageSwiper() {
    let mobileSwiper = null;

    function initSwiper() {
      if (window.innerWidth < 769 && !mobileSwiper) {
        // 모바일에서만 Swiper 초기화
        mobileSwiper = new Swiper('.img-text__img-swiper', {
          slidesPerView: 1,
          spaceBetween: 16,
          //   loop: true,
          centeredSlides: true,
          slidesPerView: '1.4',
          //   autoplay: {
          //     delay: 3000,
          //     disableOnInteraction: false,
          //   },
          //   pagination: {
          //     el: '.swiper-pagination',
          //     clickable: true,
          //   },
          pagination: {
            el: '.progress-swiper__pagination',
            type: 'progressbar',
          },
        });
      } else if (window.innerWidth >= 769 && mobileSwiper) {
        // 데스크톱에서는 Swiper 제거
        mobileSwiper.destroy(true, true);
        mobileSwiper = null;
      }
    }

    // 초기 실행
    initSwiper();

    // 윈도우 리사이즈 시 체크
    window.addEventListener('resize', initSwiper);
  }

  // 윈도우 리사이즈 시 ScrollTrigger 새로고침
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
});
