/*
  DateTitleSection: 결혼 날짜 + 타이틀 (배경색 변경 애니메이션)
*/
import { useEffect, useRef, useState } from "react";

type DateTitleSectionProps = {
  debugClass?: string;
};

export default function DateTitleSection({
  debugClass = "",
}: DateTitleSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // 반복 원하면 else도 켜
        setActive(entry.isIntersecting);
      },
      {
        threshold: 0.25, // 조금 더 일찍 준비시키고
        rootMargin: "0px 0px -10% 0px", // 살짝 아래에서부터 스무스하게
      },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref as any}
      className={`w-full py-32 ${debugClass}`}
      style={{
        backgroundColor: active ? "#7a7a7a" : "#ffffff",
        transition: "background-color 2600ms ease", // ✅ 배경 천천히
      }}
    >
      <div className="text-center select-none">
        {/* 윗줄 */}
        <div
          style={{
            paddingTop: "12px",
            fontFamily: "WeddingSignature",
            fontSize: 160,
            lineHeight: 1.5,
            color: active ? "#ffffff" : "#111111",
            opacity: active ? 1 : 0,
            // ✅ translateY 제거 (위로 올라오는 느낌 제거)
            filter: active ? "blur(0px)" : "blur(6px)", // ✅ “스르륵 맺히는” 느낌(원치 않으면 삭제)
            transition:
              "opacity 1800ms ease 500ms, filter 1800ms ease 500ms, color 2600ms ease",
          }}
        >
          Jan 16
        </div>

        {/* 아랫줄 */}
        <div
          style={{
            marginTop: 18,
            fontFamily: "WeddingSignature",
            fontSize: 160,
            lineHeight: 1,
            color: active ? "#ffffff" : "#111111",
            opacity: active ? 1 : 0,
            filter: active ? "blur(0px)" : "blur(6px)",
            transition:
              "opacity 1800ms ease 900ms, filter 1800ms ease 900ms, color 2600ms ease",
          }}
        >
          2027
        </div>
      </div>
    </section>
  );
}
