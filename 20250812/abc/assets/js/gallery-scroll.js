gsap.registerPlugin(ScrollTrigger);

const gallery = document.querySelector('.gallery');
const upBoxes = gsap.utils.toArray('.upBox');
const numBoxes = upBoxes.length;

if (gallery && upBoxes.length) {
  // z-index와 transform-origin을 설정하여 카드가 올바르게 쌓이고 고정된 것처럼 보이게 합니다.
  upBoxes.forEach((box, i) => {
    gsap.set(box, { zIndex: i, transformOrigin: 'top center' });
  });

  // 각 박스를 개별적으로 고정합니다.
  upBoxes.forEach((box, i) => {
    ScrollTrigger.create({
      trigger: box,
      pin: true,
      pinSpacing: i === numBoxes - 1, // 마지막 요소에만 pinSpacing 적용
      start: 'top top',
      end: '+=100%',
    });
  });

  // 각 전환에 대한 애니메이션을 생성합니다.
  upBoxes.forEach((box, i) => {
    if (i > 0) {
      const prevBox = upBoxes[i - 1];
      const allPrevBoxes = upBoxes.slice(0, i);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: prevBox,
          start: 'top top',
          end: '+=50%',
          scrub: true,
        },
      });

      // 1. 현재 박스가 나타나는 애니메이션
      tl.from(box, { y: '85vh', ease: 'none' }, 0);

      // 2. 모든 이전 박스들이 새로운 스택 위치로 이동하는 애니메이션
      allPrevBoxes.forEach((pBox, pIndex) => {
        const depth = i - 1 - pIndex;

        const fromState = {
          scale: 1 - depth * 0.04,
          y: -depth * 20,
        };
        const toState = {
          scale: 1 - (depth + 1) * 0.04,
          y: -(depth + 1) * 20,
        };

        tl.fromTo(pBox, fromState, { ...toState, ease: 'none' }, 0);
      });
    }
  });
}
