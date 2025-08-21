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

const headerGnb = (() => {
  const BREAKPOINT = 768;
  const ANIMATION_DELAY = 100;
  const DEBOUNCE_DELAY = 250;

  const SELECTORS = {
    header: '.main-header',
    gnb: '.gnb',
    gnbList: '.gnb__list',
    gnbItem: '.gnb__item',
    gnbToggle: '.gnb-toggle',
    activeClass: '.is-active',
    gnbChild: '.gnb__child',
    gnbLink: '.gnb__link',
    utilButton: '.main-header__util-button',
    utilDropdown: '.main-header__util-dropdown',
    utilItem: '.main-header__util-item',
  };

  const CLASSES = {
    active: 'is-active',
    gnbBlock: 'gnb-block',
    activeGnb: 'active-gnb',
    overflowHidden: 'overflow-hidden',
    expanded: 'is-expanded',
  };

  let elements = {};
  let resizeHandler = null;
  let animationTimeout = null;

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  function handleToggleClick() {
    const isOpen = elements.header.classList.contains(CLASSES.activeGnb);

    if (isOpen) {
      elements.header.classList.remove(CLASSES.activeGnb);
      document.body.classList.remove(CLASSES.overflowHidden);
    } else {
      elements.header.classList.add(CLASSES.activeGnb);
      document.body.classList.add(CLASSES.overflowHidden);
    }
  }

  function handleMobileGnbClick(event) {
    if (window.innerWidth > BREAKPOINT) return;

    event.preventDefault();

    const gnbLink = event.currentTarget;
    const gnbItem = gnbLink.closest(SELECTORS.gnbItem);
    const gnbChild = gnbItem.querySelector(SELECTORS.gnbChild);

    if (!gnbChild) return;

    const isExpanded = gnbItem.classList.contains(CLASSES.expanded);

    // 다른 모든 아이템 닫기
    elements.gnbItems.forEach((item) => {
      if (item !== gnbItem) {
        item.classList.remove(CLASSES.expanded);
        const childElement = item.querySelector(SELECTORS.gnbChild);
        if (childElement) {
          childElement.style.display = 'none';
        }
      }
    });

    // 현재 아이템 토글
    if (isExpanded) {
      gnbItem.classList.remove(CLASSES.expanded);
      setTimeout(() => {
        gnbChild.style.display = 'none';
      }, 300);
    } else {
      gnbItem.classList.add(CLASSES.expanded);
      gnbChild.style.display = 'flex';
    }
  }

  function handleMobileUtilClick(event) {
    if (window.innerWidth > BREAKPOINT) return;

    event.preventDefault();

    const utilButton = event.currentTarget;
    const utilItem = utilButton.closest(SELECTORS.utilItem);
    const utilDropdown = utilItem.querySelector(SELECTORS.utilDropdown);

    if (!utilDropdown) return;

    const isExpanded = utilItem.classList.contains(CLASSES.expanded);

    // 다른 모든 util 아이템 닫기
    document.querySelectorAll(SELECTORS.utilItem).forEach((item) => {
      if (item !== utilItem) {
        item.classList.remove(CLASSES.expanded);
        const dropdown = item.querySelector(SELECTORS.utilDropdown);
        if (dropdown) {
          dropdown.style.display = 'none';
        }
      }
    });

    // 현재 아이템 토글
    if (isExpanded) {
      utilItem.classList.remove(CLASSES.expanded);
      setTimeout(() => {
        utilDropdown.style.display = 'none';
      }, 300);
    } else {
      utilItem.classList.add(CLASSES.expanded);
      utilDropdown.style.display = 'flex';
    }
  }

  function cacheElements() {
    elements.header = document.querySelector(SELECTORS.header);
    elements.gnb = document.querySelector(SELECTORS.gnb);
    elements.gnbToggle = document.querySelector(SELECTORS.gnbToggle);

    if (!elements.header || !elements.gnb) {
      return false;
    }

    elements.gnbList = elements.gnb.querySelector(SELECTORS.gnbList);
    elements.gnbItems = elements.gnbList?.querySelectorAll(SELECTORS.gnbItem);

    if (!elements.gnbList || !elements.gnbItems?.length) {
      return false;
    }

    return true;
  }

  function initWidth() {
    if (!elements.gnbItems) return;

    elements.gnbItems.forEach((item) => {
      item.style.width = '';
      const width = item.offsetWidth;
      item.style.width = `${width}px`;
    });
  }

  function removeActiveStates() {
    const activeItem = elements.gnbList.querySelector(SELECTORS.activeClass);
    activeItem?.classList.remove(CLASSES.active);
    elements.header.classList.remove(CLASSES.gnbBlock, CLASSES.active);
  }

  function handleMouseOver(event) {
    const gnbItem = event.currentTarget;

    removeActiveStates();

    gnbItem.classList.add(CLASSES.active);
    elements.header.classList.add(CLASSES.active);

    if (animationTimeout) {
      clearTimeout(animationTimeout);
    }

    animationTimeout = setTimeout(() => {
      elements.header.classList.add(CLASSES.gnbBlock);
    }, ANIMATION_DELAY);
  }

  function handleMouseLeave() {
    removeActiveStates();

    if (animationTimeout) {
      clearTimeout(animationTimeout);
      animationTimeout = null;
    }
  }

  function initEvents() {
    if (!elements.gnbItems || !elements.gnb) return;

    elements.gnbItems.forEach((item) => {
      item.addEventListener('mouseover', handleMouseOver);
      item.addEventListener('click', handleMobileGnbClick);
    });

    elements.gnb.addEventListener('mouseleave', handleMouseLeave);

    if (elements.gnbToggle) {
      elements.gnbToggle.addEventListener('click', handleToggleClick);
    }

    document.querySelectorAll(SELECTORS.utilItem).forEach((item) => {
      item.addEventListener('click', handleMobileUtilClick);
    });
  }

  function handleResize() {
    if (window.innerWidth <= BREAKPOINT) {
      destroy();
      return;
    }
    initWidth();
  }

  function destroy() {
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }

    if (animationTimeout) {
      clearTimeout(animationTimeout);
      animationTimeout = null;
    }

    if (elements.gnbItems) {
      elements.gnbItems.forEach((item) => {
        item.removeEventListener('mouseover', handleMouseOver);
        item.removeEventListener('click', handleMobileGnbClick);
      });
    }

    if (elements.gnb) {
      elements.gnb.removeEventListener('mouseleave', handleMouseLeave);
    }

    removeActiveStates();

    if (elements.gnbToggle) {
      elements.gnbToggle.removeEventListener('click', handleToggleClick);
    }

    elements.header.classList.remove(CLASSES.activeGnb);
    document.body.classList.remove(CLASSES.overflowHidden);

    document.querySelectorAll(SELECTORS.utilItem).forEach((item) => {
      item.removeEventListener('click', handleMobileUtilClick);
    });
  }

  function init() {
    if (!cacheElements()) {
      return;
    }

    // 데스크톱에서만 마우스 이벤트와 너비 초기화
    if (window.innerWidth > BREAKPOINT) {
      initWidth();
      initEvents(); // 마우스 이벤트 + 토글 이벤트
    } else {
      // 모바일에서는 토글 이벤트만
      if (elements.gnbToggle) {
        elements.gnbToggle.addEventListener('click', handleToggleClick);
      }
      elements.gnbItems.forEach((item) => {
        item.addEventListener('click', handleMobileGnbClick);
      });
      document.querySelectorAll(SELECTORS.utilItem).forEach((item) => {
        item.addEventListener('click', handleMobileUtilClick);
      });
    }

    resizeHandler = debounce(handleResize, DEBOUNCE_DELAY);
    window.addEventListener('resize', resizeHandler);
  }
  return {
    init,
    destroy,
  };
})();

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
  setTimeout(() => headerGnb.init(), 400);
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

  transformTrand.init();

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

  // 팝업 기능 초기화
  initPopup();
});

// 팝업 기능
function initPopup() {
  const popup = document.querySelector('.popup');
  const closeBtn = document.querySelector('.btn-close');
  const galleryLinks = document.querySelectorAll('.progress-swiper__link');

  if (!popup || !closeBtn) return;

  // 닫기 버튼 클릭 이벤트
  closeBtn.addEventListener('click', function() {
    closePopup();
  });

  // 팝업 배경 클릭 시 닫기
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      closePopup();
    }
  });

  // ESC 키로 팝업 닫기
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.classList.contains('is-active')) {
      closePopup();
    }
  });

  // 갤러리 링크 클릭 시 팝업 열기
  galleryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      openPopup();
    });
  });
}

function openPopup() {
  const popup = document.querySelector('.popup');
  if (popup) {
    popup.classList.add('is-active');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
  }
}

function closePopup() {
  const popup = document.querySelector('.popup');
  if (popup) {
    popup.classList.remove('is-active');
    document.body.style.overflow = ''; // 스크롤 복원
  }
}
