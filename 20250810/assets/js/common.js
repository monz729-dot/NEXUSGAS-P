// const cliOptions = require('gulp-cli/lib/shared/cli-options');

function animateUp(selector, delay = 200, options = {}) {
  const { threshold = 0.2, once = true, ignoreOrder = false } = options;

  const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;

  if (!elements.length) {
    return;
  }

  elements.forEach((element) => {
    element.style.willChange = 'transition: transform 0.6s ease-in-out, background-color 0.6s ease-in-out;';
  });

  const runAnimation = (element, index) => {
    setTimeout(() => {
      element.classList.add('show');
      setTimeout(() => {
        element.style.willChange = '';
      }, 1000);
    }, index * delay);
  };

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element, index) => runAnimation(element, index));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const index = ignoreOrder ? 0 : Array.from(elements).indexOf(element);
          runAnimation(element, index);
          if (once) {
            observer.unobserve(element);
          }
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: threshold,
    }
  );

  elements.forEach((element) => observer.observe(element));
}

let lastScroll = 0;
const header = document.getElementById('header');
const headerHeight = header.offsetHeight;

const handleScroll = () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  if (currentScroll > lastScroll && currentScroll > headerHeight) {
    header.classList.add('header--hidden');
  } else {
    header.classList.remove('header--hidden');
  }

  lastScroll = currentScroll;
};

let isScrolling;
window.addEventListener('scroll', () => {
  window.clearTimeout(isScrolling);
  isScrolling = setTimeout(handleScroll, 10);
});

function initImageAccordion() {
  const setContentHeight = (content, isOpen) => {
    if (isOpen) {
      content.style.maxHeight = 'none';
      content.style.height = 'auto';
      content.style.overflow = 'visible';
      content.style.paddingTop = '20px';
      content.style.paddingBottom = '20px';

      const height = content.scrollHeight;
      content.style.maxHeight = height + 40 + 'px';
      content.style.height = '';
      content.style.overflow = 'hidden';
      content.style.opacity = '1';
    } else {
      content.style.maxHeight = '0';
      content.style.opacity = '0';
      content.style.paddingTop = '0';
      content.style.paddingBottom = '0';
    }
    content.style.transition = 'all 0.3s ease';
  };

  const updateImage = (button, imageContainer) => {
    const imageSrc = button.getAttribute('data-image');
    const img = imageContainer?.querySelector('img');
    if (img && imageSrc) {
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = imageSrc;
        img.alt = button.querySelector('.image-accordion__title').textContent;
        img.style.opacity = '1';
      }, 150);
    }
  };

  document.querySelectorAll('.image-accordion').forEach((accordion) => {
    const items = accordion.querySelectorAll('.image-accordion__item');
    const buttons = accordion.querySelectorAll('.image-accordion__button');
    const imageContainer = accordion.querySelector('.image-accordion__image');

    if (imageContainer && !imageContainer.querySelector('img')) {
      const img = document.createElement('img');
      img.className = 'image-accordion__img';
      Object.assign(img.style, {
        width: '100%',
        height: 'auto',
        transition: 'opacity 0.6s ease',
      });
      imageContainer.appendChild(img);
    }

    const activeItem = accordion.querySelector('.image-accordion__item.is-active');
    if (activeItem && imageContainer) {
      const activeButton = activeItem.querySelector('.image-accordion__button');
      updateImage(activeButton, imageContainer);
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const currentItem = button.closest('.image-accordion__item');

        if (currentItem.classList.contains('is-active')) return;

        const scrollY = window.scrollY;
        const accordionRect = accordion.getBoundingClientRect();
        const accordionTop = accordionRect.top + scrollY;
        const isAccordionAboveViewport = accordionTop < scrollY;

        const activeItem = accordion.querySelector('.image-accordion__item.is-active');
        const activeContent = activeItem?.querySelector('.image-accordion__content');
        const oldHeight = activeContent ? activeContent.scrollHeight : 0;

        items.forEach((item) => {
          item.classList.remove('is-active');
          const content = item.querySelector('.image-accordion__content');
          const icon = item.querySelector('.image-accordion__icon');

          if (content) setContentHeight(content, false);
        });

        currentItem.classList.add('is-active');
        const content = currentItem.querySelector('.image-accordion__content');
        const icon = currentItem.querySelector('.image-accordion__icon');

        if (content) {
          content.style.maxHeight = 'none';
          content.style.height = 'auto';
          content.style.overflow = 'visible';
          content.style.paddingTop = '20px';
          content.style.paddingBottom = '20px';

          const newHeight = content.scrollHeight;
          const heightDiff = newHeight - oldHeight;

          content.offsetHeight;
          setContentHeight(content, true);

          if (isAccordionAboveViewport && heightDiff > 0) {
            setTimeout(() => {
              const newScrollY = scrollY + heightDiff;
              window.scrollTo({
                top: newScrollY,
                behavior: 'auto',
              });
            }, 300);
          }
        }

        updateImage(button, imageContainer);
      });
    });

    items.forEach((item) => {
      const content = item.querySelector('.image-accordion__content');
      const icon = item.querySelector('.image-accordion__icon');
      const isActive = item.classList.contains('is-active');

      if (content) setContentHeight(content, isActive);
    });
  });
}

const progressSwiper = new Swiper('.progress-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 40,
  speed: 1000,
  pagination: {
    el: '.progress-swiper__pagination',
    type: 'progressbar',
  },
});

/**
 * 스크롤에 따라 히어로 섹션의 이미지를 확대하고 단계별 애니메이션을 제어합니다.
 */
const enlargeImageOnScroll = (() => {
  // GSAP 플러그인 등록
  gsap.registerPlugin(ScrollTrigger);

  // 설정 상수
  const CONFIG = {
    // 애니메이션 진행도에 따른 클래스 토글 임계값
    ENLARGE_THRESHOLD: 0.1,
    // 단계별 진행도 계산을 위한 기본값 (전체 진행도의 70%를 단계별로 분배)
    PROGRESS_RATIO: 0.7,
    // 단일 단계일 때의 추가 스크롤 비율 (단계가 1개일 때 더 긴 스크롤 적용)
    SINGLE_STEP_MULTIPLIER: 2,
  };

  /**
   * 요소에서 클래스를 제거하는 헬퍼 함수
   * @param {HTMLElement} element - 대상 요소
   * @param {string[]} classNames - 제거할 클래스 이름 배열
   */
  const removeClasses = (element, classNames) => {
    classNames.forEach((className) => {
      element.classList.remove(className);
    });
  };

  /**
   * 모든 스텝 요소 초기화
   * @param {NodeList} steps - 초기화할 스텝 요소들
   */
  const resetSteps = (steps) => {
    steps.forEach((step) => {
      if (step) removeClasses(step, ['in', 'out']);
    });
  };

  /**
   * 애니메이션 초기화 및 설정
   */
  const init = () => {
    const container = document.querySelector('.hero-container');
    if (!container) return;

    const steps = container.querySelectorAll('.hero-step');
    const stepCount = steps.length;

    // 유효성 검사
    if (!stepCount) return;

    // 단계별 진행도 계산
    const progressStep = CONFIG.PROGRESS_RATIO / stepCount;
    const progressThresholds = Array.from({ length: stepCount }, (_, i) => progressStep * (i + 1));

    // ScrollTrigger 설정
    ScrollTrigger.create({
      trigger: container,
      start: 'top',
      end: `+=${(stepCount === 1 ? CONFIG.SINGLE_STEP_MULTIPLIER : stepCount) * 100}%`,
      pin: true,
      onEnter: () => resetSteps(steps),
      onLeave: () => resetSteps(steps),
      onLeaveBack: () => resetSteps(steps),
      onUpdate: (self) => {
        const { progress } = self;

        // 확대/축소 클래스 토글
        container.classList.toggle('enlarge', progress >= CONFIG.ENLARGE_THRESHOLD);

        // 모든 스텝 초기화
        resetSteps(steps);

        // 진행도에 따라 단계별로 'in' 클래스 추가
        progressThresholds.forEach((threshold, index) => {
          if (progress >= threshold && steps[index]) {
            steps[index].classList.add('in');
          }
        });
      },
    });
  };

  return { init };
})();

const transformTrand = (() => {
  gsap.registerPlugin(ScrollTrigger);

  const CONFIG = {
    PROGRESS_RATIO: 0.8,
  };

  const container = document?.querySelector('.trand');

  if (!container) return;
  const trandSteps = container.querySelectorAll('.trand__step');
  const stepCount = trandSteps.length;

  const progressStep = CONFIG.PROGRESS_RATIO / stepCount;
  const progressThresholds = Array.from({ length: stepCount }, (_, i) => progressStep * (i + 1));

  const activeTrand = () => {
    const title = container.querySelector('.trand__title');
    const steps = container.querySelector('.trand__steps');
    console.log('in');

    title.classList.add('in');
    steps.classList.add('in');
  };

  const init = () => {
    ScrollTrigger.create({
      trigger: container,
      start: 'top',
      end: `+=${trandSteps.length * 50}%`,
      pin: true,
      onUpdate: (self) => {
        const { progress } = self;

        progress > 0.1 ? activeTrand() : null;

        progressThresholds.forEach((threshold, index) => {
          if (progress >= threshold && trandSteps[index]) {
            trandSteps[index].classList.add('current');
          } else {
            trandSteps[index].classList.remove('current');
          }
        });

        let currentIndex = -1;
        for (let i = 0; i < progressThresholds.length; i++) {
          if (progress >= progressThresholds[i]) {
            currentIndex = i;
          }
        }

        trandSteps.forEach((step, index) => {
          step.classList.remove('prev', 'out');

          if (currentIndex !== -1) {
            const diff = Math.abs(index - currentIndex);

            if (diff === 1) {
              step.classList.add('prev');
            } else if (diff >= 2) {
              step.classList.add('out');
            }
          }
        });
      },
    });
  };

  return { init };
})();

function goTop() {
  gsap.to('html, body', { duration: 0.5, scrollTop: 0, ease: Power3.easeOut });
}

// 모바일 메뉴 토글 기능
function initMobileMenu() {
  const mobileBreakpoint = 768;
  
  function handleMobileMenu() {
    const dropdownItems = document.querySelectorAll('.gnb__dropdown-item.has-submenu, .gnb__submenu-item.has-submenu');
    const utilItems = document.querySelectorAll('.main-header__util-item');
    const familySite = document.querySelector('.main-footer__family-site');
    
    if (window.innerWidth <= mobileBreakpoint) {
      // 모바일에서 클릭 이벤트 추가
      dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        const submenu = item.querySelector('.gnb__submenu, .gnb__subsubmenu');
        
        if (link && submenu) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            item.classList.toggle('mobile-open');
          });
        }
      });
      
      // 유틸리티 메뉴 클릭 이벤트
      utilItems.forEach(item => {
        const button = item.querySelector('.main-header__util-button.has-dropdown');
        const dropdown = item.querySelector('.main-header__util-dropdown');
        
        if (button && dropdown) {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            item.classList.toggle('mobile-open');
          });
        }
      });
      
      // 패밀리 사이트 클릭 이벤트
      if (familySite) {
        const button = familySite.querySelector('.main-footer__family-site-button');
        const dropdown = familySite.querySelector('.main-footer__family-dropdown');
        
        if (button && dropdown) {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            familySite.classList.toggle('mobile-open');
          });
        }
      }
    } else {
      // 데스크톱에서 클릭 이벤트 제거
      dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
          link.removeEventListener('click', () => {});
        }
      });
      
      utilItems.forEach(item => {
        const button = item.querySelector('.main-header__util-button.has-dropdown');
        if (button) {
          button.removeEventListener('click', () => {});
        }
      });
      
      // 패밀리 사이트 클릭 이벤트 제거
      if (familySite) {
        const button = familySite.querySelector('.main-footer__family-site-button');
        if (button) {
          button.removeEventListener('click', () => {});
        }
      }
    }
  }
  
  // 초기 실행
  handleMobileMenu();
  
  // 리사이즈 이벤트
  window.addEventListener('resize', handleMobileMenu);
}

function historyContent() {
  const historyWrap = document.querySelector('.history-list');
  let currentIndex = 0;

  if (historyWrap) {
    const fixedButton = historyWrap.querySelector('.history-list__fixed');
    const historyItems = historyWrap.querySelectorAll('.history-list__item');

    ScrollTrigger.matchMedia({
      '(min-width: 1025px)': function () {
        historyItems.forEach((item, i) => {
          const fadeText = item.querySelector('.history-list__img-text');
          const image = item.querySelector('.history-list__bg');
          const progress = item.querySelector('.history-list__progress');
          const progressBar = progress.querySelector('.history-list__progress-inner');
          const hContent = item.querySelector('.history-list__content');
          const dimmed = image.querySelector('.dimmed');
          const text = item.querySelector('.history-list__sub-text');

          const current = hContent.querySelectorAll('.history-list__caption');

          let scrollHeight = current.length;

          const historyMotion = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top top',
              end: '+=250%',
              endTrigger: hContent,
              scrub: 1,
              pin: true,
              onEnter() {
                currentIndex = i;
              },
              onEnterBack() {
                currentIndex = i;
              },
            },
          });

          historyMotion
            .to(fadeText, 0, { opacity: 0 })
            .to(fadeText, 3, { opacity: 1 })
            .to(fadeText, 1.5, { opacity: 1 })
            .to(fadeText, 1.5, { opacity: 0 })
            .to(image, 2, { scale: 1 })
            .to(image, 2, { y: `-${window.innerHeight / 4 - 20}px` }, '<=')
            .to(image, 2, { scale: 0.334 })
            .to(dimmed, 2, { opacity: 0 })
            .to(image, 2, { css: { borderRadius: '12px' } })
            .to(image, 1.5, { x: 0 })

            .to(image, 2, { x: `-${window.innerWidth / 4 - 20}px` })
            .to(text, 1, { x: `-${window.innerWidth / 4 - 20}px`, opacity: 1 })
            .to(image, 1, { className: 'history-list__bg active' })
            .to(hContent, 0.8, { opacity: 1 })
            .to(progress, 0.8, { opacity: 1 })
            .to(hContent, scrollHeight, { y: '-85%' }, '>=')
            .to(progressBar, scrollHeight, { top: 'calc(100% - 100px)', ease: Power3.easeOut }, '<=');
        });
      },
    });
  }
}

const subMainVisual = new Swiper('.submain-swiper__inner .swiper', {
  spaceBetween: 30,
  effect: 'fade',
  centeredSlides: true,
  speed: 1000,
  loop: true,
  allowTouchMove: false,
  pagination: {
    el: '.submain-swiper__pagination',
    clickable: true,
    bulletClass: 'submain-swiper__pagination-bullet',
    bulletActiveClass: 'is-active',
    renderBullet: function (index, className) {
      return `
      <div class="${className}" data-index="${index}">${['설비 부문', '기술 부문', '솔루션 부문', 'R&D'][index]}</div>
      `;
    },
  },
  on: {
    init: function () {
      // Initialize active state on first load
      const bullets = document.querySelectorAll('.submain-swiper__pagination-bullet');
      if (bullets.length > 0) {
        bullets[0].classList.add('is-active');
      }
    },
    slideChange: function () {
      const bullets = document.querySelectorAll('.submain-swiper__pagination-bullet');
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
    delay: 6000,
    disableOnInteraction: false,
  },
});

document.addEventListener('DOMContentLoaded', () => {
  handleScroll();
  initImageAccordion();

  enlargeImageOnScroll.init();

  animateUp('.rise', 400, {
    threshold: 0.1,
  });
  animateUp('.rise-fast', 10, {
    threshold: 0.2,
    ignoreOrder: true,
  });
  historyContent();
  goTop();

  // transformTrand가 존재할 때만 초기화
  if (typeof transformTrand !== 'undefined' && transformTrand && typeof transformTrand.init === 'function') {
    transformTrand.init();
  }

  // Initialize Lenis smooth scrolling only for BU00.html
  if (document.querySelector('.submain')) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const snap = new Snap(lenis, {});
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // FAQ 아코디언 기능
  const accordionWraps = document.querySelectorAll('[data-accordion="wrap"]');

  accordionWraps.forEach((wrap) => {
    const accordionButtons = wrap.querySelectorAll('[data-accordion="button"]');

    accordionButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const accordionItem = this.closest('[data-accordion="item"]');
        const accordionContent = accordionItem.querySelector('[data-accordion="content"]');
        const isActive = accordionItem.classList.contains('is-active');

        wrap.querySelectorAll('[data-accordion="item"]').forEach((item) => {
          if (item !== accordionItem) {
            item.classList.remove('is-active');
            const content = item.querySelector('[data-accordion="content"]');
            if (content) {
              content.style.maxHeight = null;
            }
          }
        });

        if (isActive) {
          accordionItem.classList.remove('is-active');
          accordionContent.style.maxHeight = null;
        } else {
          accordionItem.classList.add('is-active');
          accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
        }
      });
    });
  });
});

document.querySelectorAll('.contents-tab__item').forEach((tab) => {
  tab.addEventListener('click', function () {
    const selected = this.dataset.tab;

    // 탭 버튼 active 전환
    document.querySelectorAll('.contents-tab__item').forEach((btn) => btn.classList.toggle('is-active', btn === this));

    // 콘텐츠 전환
    document
      .querySelectorAll('[data-content]')
      .forEach((content) => content.classList.toggle('is-visible', content.dataset.content === selected));
  });
});

//  뉴스 스와이퍼
const swiper = new Swiper('.swiper--news-swiper', {
  loop: true,
  spaceBetween: 24,
  pagination: {
    el: '.swiper-pagination',
    type: 'fraction',
    formatFractionCurrent: function (number) {
      return ('0' + number).slice(-2);
    },
    formatFractionTotal: function (number) {
      return ('0' + number).slice(-2);
    },
    renderFraction: function (currentClass, totalClass) {
      return `
        <span class="${currentClass}"></span>
        <span class="divider"></span>
        <span class="${totalClass}"></span>
      `;
    },
  },
  scrollbar: {
    el: '.swiper-scrollbar',
  },
  navigation: {
    nextEl: '.btn-next',
    prevEl: '.btn-prev',
  },
});

const trandSwiper = new Swiper('.trand-swiper-section .swiper', {
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 24,
  pagination: {
    el: '.swiper-pagination',
    type: 'fraction',
    formatFractionCurrent: function (number) {
      return ('0' + number).slice(-2);
    },
    formatFractionTotal: function (number) {
      return ('0' + number).slice(-2);
    },
    renderFraction: function (currentClass, totalClass) {
      return `
        <span class="${currentClass}"></span>
        <span class="step-scroll">
          <span class="step-scroll__bar"></span>
        </span>
        <span class="${totalClass}"></span>
      `;
    },
  },

  navigation: {
    nextEl: '.pagenation-step__prev',
    prevEl: '.pagenation-step__next',
  },

  on: {
    slideChange: function () {
      const stepScrollBar = document.querySelector('.step-scroll__bar');
      if (stepScrollBar) {
        const progress = this.realIndex / (this.slides.length - 1);
        const maxDistance = 40; // 60px - 20px(bar width) = 40px 이동 가능 거리
        stepScrollBar.style.transform = `translateX(${progress * maxDistance}px)`;
      }
    },
    init: function () {
      // 초기 로드 시에도 스크롤바 설정
      const stepScrollBar = document.querySelector('.step-scroll__bar');
      if (stepScrollBar) {
        const progress = this.realIndex / (this.slides.length - 1);
        const maxDistance = 40;
        stepScrollBar.style.transform = `translateX(${progress * maxDistance}px)`;
      }
    },
  },
});

const swiperRow = new Swiper('.swiper--row', {
  watchSlidesProgress: true,
  slidesPerView: 3,

  on: {
    resize: function () {
      swiper.changeDirection(getDirection());
    },
  },
});

// 스크롤 이벤트

// gsap.registerPlugin(ScrollTrigger);

// let upBox = document.querySelectorAll('.upBox');

// // 카드 스택 효과 - 스크롤할 때마다 하나씩 쌓이기
// upBox.forEach((box, index) => {
//   // 초기 상태: 모든 카드를 아래쪽에 숨김
//   gsap.set(box, {
//     y: 400,
//     x: 0,
//     opacity: 0,
//     scale: 0.8,
//     zIndex: index,
//     transformOrigin: 'center center',
//   });

//   // 각 카드가 개별적으로 나타나는 애니메이션
//   ScrollTrigger.create({
//     trigger: '.gallery',
//     start: `top+=${index * 300} bottom`,
//     end: `top+=${(index + 1) * 300} bottom`,
//     onEnter: () => {
//       // 현재 카드 애니메이션
//       gsap.to(box, {
//         y: -index * 12, // 위로 쌓이면서 겹치기
//         x: index * 8, // 오른쪽으로 약간씩 이동
//         opacity: 1,
//         scale: 1,
//         duration: 1.2,
//         ease: 'power2.out',
//         delay: index * 0.05,
//       });

//       // 이전 카드들을 작게 만들기
//       for (let i = 0; i < index; i++) {
//         gsap.to(upBox[i], {
//           scale: 0.95 - i * 0.02, // 더 아래쪽 카드일수록 더 작게
//           duration: 0.8,
//           ease: 'power2.out',
//         });
//       }
//     },
//     onLeave: () => {
//       // 스크롤이 지나가면 카드가 더 위로 올라가면서 작아짐
//       gsap.to(box, {
//         y: -100 - index * 20,
//         x: index * 15,
//         scale: 0.85 - index * 0.03,
//         duration: 0.8,
//         ease: 'power2.out',
//       });
//     },
//     onEnterBack: () => {
//       // 역방향 스크롤 시 원래 위치로
//       gsap.to(box, {
//         y: -index * 12,
//         x: index * 8,
//         scale: 1,
//         duration: 0.8,
//         ease: 'power2.out',
//       });

//       // 이전 카드들도 원래 크기로 복원
//       for (let i = 0; i < index; i++) {
//         gsap.to(upBox[i], {
//           scale: 0.95 - i * 0.02,
//           duration: 0.8,
//           ease: 'power2.out',
//         });
//       }
//     },
//     onLeaveBack: () => {
//       // 역방향으로 벗어나면 다시 숨김
//       gsap.to(box, {
//         y: 400,
//         x: 0,
//         opacity: 0,
//         scale: 0.8,
//         duration: 1.0,
//         ease: 'power2.in',
//       });

//       // 이전 카드들을 원래 크기로 복원
//       for (let i = 0; i < index; i++) {
//         gsap.to(upBox[i], {
//           scale: 1,
//           duration: 0.8,
//           ease: 'power2.out',
//         });
//       }
//     },
//   });
// });

// let tl = gsap.timeline({
//   scrollTrigger: {
//     trigger: '.gallery',
//     toggleActions: 'resume pause reset pause',
//     pin: true,
//     // markers: true,
//     start: 'top top',
//     end: `+=${upBox.length * 300 + 800}%`, // 더 긴 스크롤 거리
//   },
// });

// // 갤러리 컨테이너 고정 효과
// tl.to('.gallery', {
//   duration: upBox.length * 3, // 더 긴 지속시간
//   ease: 'none',
// });

document.addEventListener('DOMContentLoaded', function () {
  const limitText = (selector, max) => {
    document.querySelectorAll(selector).forEach((el) => {
      const text = el.textContent.trim();
      if (text.length > max) {
        el.textContent = text.substring(0, max) + '...';
      }
    });
  };

  limitText('.info-cards__title', 28);
  limitText('.slide-item__title', 28);

  // 통합 메가메뉴 기능
  const header = document.getElementById('header');
  const megaMenu = document.getElementById('mega-menu');
  const gnbLinks = document.querySelectorAll('.gnb__link[data-menu]');
  const megaCols = document.querySelectorAll('.mega__col[data-col]');
  
  let showTimer, hideTimer;

  // 메가메뉴 표시
  function showMegaMenu() {
    clearTimeout(hideTimer);
    showTimer = setTimeout(() => {
      header.classList.add('is-open');
      megaMenu.classList.add('is-active');
      megaMenu.style.opacity = '1';
      megaMenu.style.visibility = 'visible';
      megaMenu.setAttribute('aria-hidden', 'false');
    }, 180);
  }

  // 메가메뉴 숨김
  function hideMegaMenu() {
    clearTimeout(showTimer);
    hideTimer = setTimeout(() => {
      header.classList.remove('is-open');
      megaMenu.classList.remove('is-active');
      megaMenu.style.opacity = '0';
      megaMenu.style.visibility = 'hidden';
      megaMenu.setAttribute('aria-hidden', 'true');
      
      // 모든 활성 상태 제거
      gnbLinks.forEach(link => link.classList.remove('is-active'));
      megaCols.forEach(col => col.classList.remove('is-active'));
    }, 180);
  }

  // 메뉴 하이라이트
  function highlightMenu(menuType) {
    // 기존 활성 상태 제거
    gnbLinks.forEach(link => link.classList.remove('is-active'));
    megaCols.forEach(col => col.classList.remove('is-active'));
    
    if (menuType) {
      // 상단 메뉴 하이라이트
      const activeLink = document.querySelector(`.gnb__link[data-menu="${menuType}"]`);
      if (activeLink) {
        activeLink.classList.add('is-active');
      }
      
      // 메가메뉴 컬럼 하이라이트
      const activeCol = document.querySelector(`.mega__col[data-col="${menuType}"]`);
      if (activeCol) {
        activeCol.classList.add('is-active');
      }
    }
  }

  // GNB 링크 이벤트
  gnbLinks.forEach(link => {
    const menuType = link.getAttribute('data-menu');
    
    link.addEventListener('mouseenter', () => {
      showMegaMenu();
      highlightMenu(menuType);
    });
    
    link.addEventListener('mouseleave', () => {
      // 마우스가 메가메뉴로 이동할 수 있도록 즉시 숨기지 않음
    });
  });

  // 메가메뉴 컬럼 이벤트
  megaCols.forEach(col => {
    const colType = col.getAttribute('data-col');
    
    col.addEventListener('mouseenter', () => {
      highlightMenu(colType);
    });
  });

  // 메가메뉴 개별 링크 이벤트 (2depth 메뉴 항목들)
  const megaLinks = document.querySelectorAll('.mega__col-list a');
  megaLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const parentCol = link.closest('.mega__col');
      if (parentCol) {
        const colType = parentCol.getAttribute('data-col');
        highlightMenu(colType);
      }
    });
  });

  // 메가메뉴 전체 영역 이벤트
  if (megaMenu) {
    megaMenu.addEventListener('mouseenter', () => {
      clearTimeout(hideTimer);
    });
    
    megaMenu.addEventListener('mouseleave', () => {
      hideMegaMenu();
    });
  }

  // 헤더 전체 영역 이벤트
  if (header) {
    header.addEventListener('mouseleave', () => {
      hideMegaMenu();
    });
  }

  // 고객지원 드롭다운은 CSS hover로 처리
});
