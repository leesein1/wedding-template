import { useEffect, useMemo, useRef, useState } from "react";
import mainPhoto from "../../../assets/img/MpQzplg2hn.png";

type HeroPhotoSectionProps = {
  debugClass?: string;
};

type Flake = {
  leftPct: number;     // 시작 x 위치 (%)
  sizePx: number;      // 크기
  opacity: number;     // 투명도
  durationS: number;   // 떨어지는 시간
  delayS: number;      // 시작 딜레이(음수로 주면 자연스럽게 이미 떨어지는 상태)
  driftVw: number;     // 좌측으로 밀리는 정도 (vw)
  blurPx: number;      // 살짝 흐림
};

function SnowOverlay({ active }: { active: boolean }) {
  // ✅ 눈 너무 많으면 가리니까 개수 적게
  const COUNT = 24;

  // 새로고침해도 같은 패턴 유지(렌더링마다 랜덤 재생성 방지)
  const flakes = useMemo<Flake[]>(() => {
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    return Array.from({ length: COUNT }).map(() => ({
      leftPct: rand(45, 105),          // ✅ 우측 위 느낌: 시작을 오른쪽 쪽에 몰아줌
      sizePx: rand(4, 10),             // ✅ 크기 약간 다양하게 
      opacity: rand(0.4, 0.6),
      durationS: rand(9, 15),          // ✅ 천천히
      delayS: -rand(0, 12),            // ✅ 처음부터 “이미 떨어지는 중”처럼 보이게
      driftVw: rand(22, 42),            // ✅ 우→좌 대각선 드리프트
      blurPx: rand(0, 0.8),
    }));
  }, []);

  if (!active) return null;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="snowflake"
            style={
              {
                left: `${f.leftPct}%`,
                "--size": `${f.sizePx}px`,
                "--opacity": f.opacity,
                "--dur": `${f.durationS}s`,
                "--delay": `${f.delayS}s`,
                "--drift": `${f.driftVw}vw`,
                "--blur": `${f.blurPx}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* ✅ 컴포넌트 내부 CSS */}
      <style>{`
        .snowflake{
          position:absolute;
          top:-12vh;
          width: var(--size);
          height: var(--size);
          opacity: var(--opacity);
          filter: blur(var(--blur));
          border-radius: 999px;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 0 10px rgba(255,255,255,0.15);
          transform: translate3d(0,0,0);
          animation: snowFallDiagonal var(--dur) linear var(--delay) infinite;
          will-change: transform;
        }

        @keyframes snowFallDiagonal{
          0%{
            transform: translate3d(0, -10vh, 0);
          }
          100%{
            /* ✅ 우측 위 → 좌측 아래 */
            transform: translate3d(calc(-1 * var(--drift)), 115vh, 0);
          }
        }

        /* 모션 줄이기 설정 존중 */
        @media (prefers-reduced-motion: reduce){
          .snowflake{ animation: none; }
        }
      `}</style>
    </>
  );
}

export default function HeroPhotoSection({ debugClass = "" }: HeroPhotoSectionProps) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  const HEART_DRAW_MS = 1500;
  const TEXT_IN_DELAY_MS = 300;
  const HOLD_MS = 2000;
  const FADE_OUT_MS = 1500;

  useEffect(() => {
    const t1 = window.setTimeout(
      () => setPhase(1),
      HEART_DRAW_MS + TEXT_IN_DELAY_MS
    );
    const t2 = window.setTimeout(
      () => setPhase(2),
      HEART_DRAW_MS + TEXT_IN_DELAY_MS + HOLD_MS
    );
    const t3 = window.setTimeout(
      () => setPhase(3),
      HEART_DRAW_MS + TEXT_IN_DELAY_MS + HOLD_MS + FADE_OUT_MS
    );

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const introVisible = phase < 3;

  // ✅ 하트 그리기 끝난 뒤부터 눈 시작
  // phase=1이 되는 시점이 “하트+텍스트 인” 이후지만,
  // 네 요구(하트 끝나면 시작)랑 거의 동일하게 자연스럽게 보임.
  const snowActive = phase >= 1;

  const lockAppliedRef = useRef(false);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    const prevOverflow = body.style.overflow;
    const prevTouchAction = body.style.touchAction;
    const prevPaddingRight = body.style.paddingRight;

    if (introVisible && !lockAppliedRef.current) {
      const scrollBarW = window.innerWidth - html.clientWidth;

      body.style.overflow = "hidden";
      body.style.touchAction = "none";
      body.style.paddingRight = scrollBarW > 0 ? `${scrollBarW}px` : "";

      lockAppliedRef.current = true;
    }

    if (!introVisible && lockAppliedRef.current) {
      body.style.overflow = prevOverflow || "";
      body.style.touchAction = prevTouchAction || "";
      body.style.paddingRight = prevPaddingRight || "";

      lockAppliedRef.current = false;
    }

    return () => {
      body.style.overflow = prevOverflow || "";
      body.style.touchAction = prevTouchAction || "";
      body.style.paddingRight = prevPaddingRight || "";
      lockAppliedRef.current = false;
    };
  }, [introVisible]);

  useEffect(() => {
    if (!introVisible) return;

    const prevent = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });

    return () => {
      window.removeEventListener("wheel", prevent as any);
      window.removeEventListener("touchmove", prevent as any);
    };
  }, [introVisible]);

  return (
    <section className={`relative w-full h-[100dvh] overflow-hidden ${debugClass}`}>
      {/* 1) 배경 */}
      <img
        src={mainPhoto}
        alt="웨딩 메인 사진"
        className="absolute inset-0 w-full h-full object-cover transition-all ease-out"
        style={{
          transitionDuration: "1600ms",
          transform: introVisible ? "scale(1.04)" : "scale(1)",
          filter: introVisible ? "blur(2px) brightness(0.75)" : "blur(0px) brightness(1)",
        }}
      />

      {/* ✅ 눈 오버레이 (하트 끝나면 시작) */}
      <SnowOverlay active={snowActive} />

      {/* 2) 인트로 오버레이 */}
      <div
        className="absolute inset-0 transition-opacity ease-out"
        style={{
          transitionDuration: `${FADE_OUT_MS}ms`,
          opacity: introVisible ? 1 : 0,
          pointerEvents: introVisible ? "auto" : "none",
          touchAction: introVisible ? "none" : "auto",
          overscrollBehavior: "none",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />

        {/* 하트 + 텍스트 */}
        <div
          className="absolute inset-0 flex items-center justify-center px-6"
          style={{
            transition: `opacity ${FADE_OUT_MS}ms ease`,
            opacity: phase >= 2 ? 0 : 1,
          }}
        >
          <div className="w-full max-w-[380px]">
            <svg viewBox="0 0 400 360" className="w-full h-auto">
              <path
                d="
                  M200 310
                  C 120 250, 60 190, 60 130
                  C 60 75, 95 50, 130 50
                  C 160 50, 185 65, 200 85
                  C 215 65, 240 50, 270 50
                  C 305 50, 340 75, 340 130
                  C 340 190, 280 250, 200 310
                  Z
                "
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 1400,
                  strokeDashoffset: phase === 0 ? 1400 : 0,
                  transition: `stroke-dashoffset ${HEART_DRAW_MS + 2500}ms ease-out`,
                  filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.65))",
                }}
              />

              <g
                style={{
                  opacity: phase >= 1 ? 1 : 0,
                  transform: phase >= 1 ? "translateY(0px)" : "translateY(6px)",
                  transition: "opacity 600ms ease-out, transform 600ms ease-out",
                }}
              >
                <text
                  x="200"
                  y="155"
                  textAnchor="middle"
                  fill="white"
                  style={{ fontFamily: "cursive", fontStyle: "italic", fontSize: 28 }}
                >
                  Welcome to our
                </text>

                <text
                  x="200"
                  y="198"
                  textAnchor="middle"
                  fill="white"
                  style={{
                    fontFamily: "serif",
                    fontWeight: 700,
                    fontSize: 38,
                    letterSpacing: "0.06em",
                  }}
                >
                  WEDDING
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* 하단 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      {/* 날짜 + 이름 */}
      <div
        className="absolute bottom-20 left-1/2 text-white text-center"
        style={{
          transform: phase >= 3 ? "translate(-50%, 0px)" : "translate(-50%, 8px)",
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 1000ms ease, transform 1000ms ease",
          transitionDelay: phase >= 3 ? "150ms" : "0ms",
        }}
      >
        <p
          className="whitespace-nowrap"
          style={{
            fontFamily: "serif",
            fontSize: "12px",
            letterSpacing: "0.28em",
            opacity: 0.85,
          }}
        >
          2027. 01. 16. AM 11:00
        </p>

        <p
          className="mt-2 whitespace-nowrap"
          style={{
            fontFamily: "serif",
            fontSize: "18px",
            letterSpacing: "0.06em",
          }}
        >
          이세인 &amp; 유화진
        </p>
      </div>

      {/* Scroll Down */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm transition-opacity"
        style={{
          transitionDuration: "700ms",
          opacity: phase >= 3 ? 0.8 : 0,
        }}
      >
        <div className="animate-bounce">↓ Scroll Down ↓</div>
      </div>
    </section>
  );
}