import Reveal from "@/components/common/Reveal";
import WeddingCard from "@/components/wedding/WeddingCard";

// sections are all re-exported from the `sections/index.ts` file; this
// keeps the import statement concise.  add new sections there if you
// create more.
import {
  AccountSection,
  AboutUsSection,
  CalendarSection,
  CoupleInfoSection,
  DateTitleSection,
  GallerySection,
  HeaderSection,
  HeroPhotoSection,
  LocationSection,
  TimelineSection,
  WelcomeMessageSection,
  FooterSection,
} from "@/components/wedding/sections";

/**
 * `MainWedding`은 결혼식 템플릿의 최상위 페이지 컴포넌트입니다.
 *
 * 작은 여러 `Section` 컴포넌트들을 올바른 순서로 나열하고, 물리적인
 * 초대장과 유사한 스타일 카드/컨테이너로 감싸줍니다.
 *
 * **수정 및 효과:**
 *
 *  * `debug` / `debugClass`: 개발 모드(`npm run dev`)에서는 이 플래그가
 *    자식 요소에 보조 윤곽선 클래스를 추가하여 레이아웃 디버깅에 도움을 줍니다.
 *    디버그 모드에서 적용되는 클래스 이름을 바꾸려면 아래의
 *    `const debugClass = …` 줄을 수정하세요.
 *  * `WeddingCard`: 외부 래퍼입니다. 배경색, 그림자 또는 그라디언트(위치:
 *    `components/wedding/WeddingCard.tsx`)를 변경하면 페이지 전체
 *    모양이 달라집니다. `max-w-[430px]` 스타일을 제거하면 카드가
 *    더 넓게 펼쳐집니다.
 *  * `Reveal` 컴포넌트: 각 리빌에 대한 `delayMs` prop을 조정하여 섹션이
 *    나타나는 지연 시간을 제어합니다. 값이 `0`이면 해당 섹션이 뷰에
 *    들어오자마자 표시됩니다. 값을 높이면 해당 섹션의 애니메이션이
 *    더 늦게 트리거됩니다.
 *  * 섹션 컴포넌트 자체는 일반적으로 도우미 윤곽선을 그리는
 *    `debugClass` prop을 받습니다; 추가 props를 전달하거나 섹션 파일의
 *    내용을 수정하여 텍스트, 이미지 또는 동작을 변경할 수 있습니다.
 */
export default function MainWedding() {
  const debug = import.meta.env.DEV;
  // when debug is true we apply an extra class to most child components
  // this is a simple way to visualize spacing and boundaries during
  // development.  change the string here if you want a different helper
  // class (e.g. "border border-red-500").
  const debugClass = debug ? "" : "";

  // when a new section is added to the template, it should be
  // registered in one of the lists below.  altering the `delay` value
  // controls when the Reveal wrapper triggers for that section.
  const revealedSections = [
    { Component: CoupleInfoSection, delay: 0 },
    { Component: WelcomeMessageSection, delay: 40 },
    { Component: DateTitleSection, delay: 60 },
    { Component: CalendarSection, delay: 80 },
    { Component: AboutUsSection, delay: 100 },
    { Component: TimelineSection, delay: 120 },
    { Component: GallerySection, delay: 140 },
    { Component: AccountSection, delay: 160 },
  ] as const;

  return (
    <WeddingCard>
      {/* fixed header overlay, sits on top of every section */}
      <HeaderSection debugClass={debugClass} />

      {/* hero photo with entry animation */}
      <HeroPhotoSection debugClass={debugClass} />

      {/* map over the configuration to reduce repetition */}
      {revealedSections.map(({ Component, delay }) => (
        <Reveal key={delay} delayMs={delay}>
          <Component debugClass={debugClass} />
        </Reveal>
      ))}

      {/* location section has no reveal, appears immediately */}
      <LocationSection debugClass={debugClass} />

      {/* footer is always visible at the end */}
      <FooterSection debugClass={debugClass} />
    </WeddingCard>
  );
}
