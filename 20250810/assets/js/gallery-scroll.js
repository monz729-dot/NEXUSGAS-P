// Gallery Scroll Animation with GSAP - transformTrand 패턴
const galleryScroll = (() => {
  gsap.registerPlugin(ScrollTrigger);

  const CONFIG = {
    PROGRESS_RATIO: 0.9, // 90%까지 진행률 사용
    SCALE_FACTOR: 0.1, // 스케일 축소 정도
  };

  const container = document.querySelector('.gallery');

  if (!container) return;

  const cards = container.querySelectorAll('.upBox');
  const cardCount = cards.length;

  if (cardCount === 0) return;

  // 진행률 임계값 계산
  const progressStep = CONFIG.PROGRESS_RATIO / cardCount;
  const progressThresholds = Array.from({ length: cardCount }, (_, i) => progressStep * (i + 1));

  console.log(`Found ${cardCount} cards`);

  // 초기 카드 설정
  const initCards = () => {
    cards.forEach((card, index) => {
      gsap.set(card, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: index + 1,
        y: index === 0 ? 0 : '150%',
        scale: 1,
        transformOrigin: 'center center',
      });
    });

    // 갤러리 컨테이너 설정
    gsap.set(container, {
      position: 'relative',
      height: `${cardCount * 100}vh`,
    });
  };

  // 카드 상태 리셋
  const resetCards = () => {
    cards.forEach((card, index) => {
      card.classList.remove('current', 'prev', 'next');
      gsap.set(card, {
        y: index === 0 ? 0 : '150%',
        scale: 1,
      });
    });
  };

  // 메인 초기화 함수
  const init = () => {
    initCards();

    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${cardCount * 100}%`,
      pin: true,
      pinSpacing: false,
      onUpdate: (self) => {
        const { progress } = self;

        // 모든 카드 상태 리셋
        cards.forEach((card) => {
          card.classList.remove('current', 'prev', 'next');
        });

        // 현재 활성 카드 인덱스 계산
        let currentIndex = -1;
        for (let i = 0; i < progressThresholds.length; i++) {
          if (progress >= progressThresholds[i]) {
            currentIndex = i;
          }
        }

        // 진행률에 따른 카드 애니메이션
        progressThresholds.forEach((threshold, index) => {
          const card = cards[index];
          const nextCard = cards[index + 1];

          if (progress >= threshold) {
            // 현재 카드 - 스케일 다운
            card.classList.add('current');
            gsap.set(card, {
              scale: 1 - CONFIG.SCALE_FACTOR,
              y: '0%',
            });

            // 다음 카드 - 슬라이드 업
            if (nextCard) {
              nextCard.classList.add('next');
              gsap.set(nextCard, {
                y: '0%',
                scale: 1,
              });
            }
          } else {
            // 아직 도달하지 않은 카드들
            const localProgress = Math.max(
              0,
              (progress - (index > 0 ? progressThresholds[index - 1] : 0)) / progressStep
            );

            if (index === 0 || progress > (index > 0 ? progressThresholds[index - 1] : 0)) {
              // 현재 전환 중인 카드
              card.classList.add('current');
              gsap.set(card, {
                scale: 1 - localProgress * CONFIG.SCALE_FACTOR,
                y: '0%',
              });

              // 다음 카드 슬라이드 업 애니메이션
              if (nextCard) {
                nextCard.classList.add('next');
                gsap.set(nextCard, {
                  y: `${150 - localProgress * 150}%`,
                  scale: 1,
                });
              }
            } else {
              // 아직 시작되지 않은 카드들
              gsap.set(card, {
                y: index === 0 ? '0%' : '150%',
                scale: 1,
              });
            }
          }
        });

        // 이전 카드들 상태 설정
        cards.forEach((card, index) => {
          if (currentIndex !== -1) {
            const diff = index - currentIndex;

            if (diff < 0) {
              card.classList.add('prev');
            }
          }
        });
      },
    });

    console.log('Gallery scroll animation initialized');
  };

  return { init };
})();

// 초기화
document.addEventListener('DOMContentLoaded', function () {
  if (galleryScroll) {
    galleryScroll.init();
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
  console.log('Window resized, ScrollTrigger refreshed');
});
