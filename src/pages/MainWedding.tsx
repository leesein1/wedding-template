import Reveal from "@/components/common/Reveal";
import DateTitleSection from "@/components/wedding/sections/DateTitleSection";
import AboutUsSection from "@/components/wedding/sections/AboutUsSection";
import {
  AccountSection,
  CalendarSection,
  CoupleInfoSection,
  GallerySection,
  HeaderSection,
  HeroPhotoSection,
  LocationSection,
  WelcomeMessageSection,
} from "@/components/wedding/sections";
import TimelineSection from "@/components/wedding/sections/TimelineSection";
import FooterSection from "@/components/wedding/sections/FooterSection";

export default function MainWedding() {
  const debug = import.meta.env.DEV;
  const box = debug ? "" : "";

  return (
    // ✅ 바깥 배경 + 더 진한 양쪽 인셋 그림자(볼록 튀어나온 느낌 강화)
    <div className="relative min-h-screen w-full bg-[#ecebe8] flex justify-center">
      {/* 왼쪽: 폭/진하기 업 + 아주 약한 블러 */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black/18 to-transparent blur-[0.5px]" />
      {/* 오른쪽 */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black/18 to-transparent blur-[0.5px]" />

      {/* ✅ 카드 컨테이너: 그림자 2겹(떠있는 느낌) + 아주 약한 하이라이트 */}
      <div
        className="relative w-full max-w-[430px] bg-[#fbfbfb] text-black flex flex-col"
        style={{
          boxShadow:
            "0 28px 70px rgba(0,0,0,0.14), 0 10px 22px rgba(0,0,0,0.07)",
        }}
      >
        {/* 상단 아주 약한 하이라이트(종이 느낌) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/70 to-transparent" />

        {/* 카드 기준으로 우측상단 고정 오버레이 */}
        <HeaderSection debugClass={box} />

        {/* Hero는 인트로 애니메이션 있으니 그대로 */}
        <HeroPhotoSection debugClass={box} />

        {/* 아래부터 스크롤 리빌 */}
        <Reveal delayMs={0}>
          <CoupleInfoSection debugClass={box} />
        </Reveal>

        <Reveal delayMs={40}>
          <WelcomeMessageSection debugClass={box} />
        </Reveal>

        <Reveal delayMs={60}>
          <DateTitleSection debugClass={box} />
        </Reveal>

        <Reveal delayMs={80}>
          <CalendarSection debugClass={box} />
        </Reveal>

        <Reveal delayMs={100}>
          <AboutUsSection debugClass={box} />
        </Reveal>

        <Reveal delayMs={120}>
          <TimelineSection debugClass={box} />
        </Reveal>

        <Reveal delayMs={140}>
          <GallerySection debugClass={box} />
        </Reveal>

        <LocationSection debugClass={box} />

        <Reveal delayMs={160}>
          <AccountSection debugClass={box} />
        </Reveal>

        <FooterSection debugClass={box} />
      </div>
    </div>
  );
}
