/*
  HeroPhotoSection: 메인 사진 + 하트 드로잉 애니메이션
  
  첫 화면 로드 시:
  - 맨 위에 있으면 스크롤 잠금 & 애니메이션 재생
  - 아래로 스크롤된 상태에서 리로드하면 스크롤 잠금 없음
*/
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import mainPhoto from "@/assets/img/흑백1.png";

type HeroPhotoSectionProps = {
  debugClass?: string;
};

type Flake = {
  leftPct: number;
  sizePx: number;
  opacity: number;
  durationS: number;
  delayS: number;
  driftVw: number;
  blurPx: number;
};

function SnowOverlay({ active }: { active: boolean }) {
  const COUNT = 24;

  const flakes = useMemo<Flake[]>(() => {
    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    return Array.from({ length: COUNT }).map(() => ({
      leftPct: rand(45, 105),
      sizePx: rand(4, 10),
      opacity: rand(0.4, 0.6),
      durationS: rand(9, 15),
      delayS: -rand(0, 12),
      driftVw: rand(22, 42),
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
          animation: snowFallDiagonal var(--dur) linear var(--delay) infinite;
        }

        @keyframes snowFallDiagonal{
          0%{ transform: translate3d(0, -10vh, 0); }
          100%{
            transform: translate3d(calc(-1 * var(--drift)), 115vh, 0);
          }
        }

        @media (prefers-reduced-motion: reduce){
          .snowflake{ animation: none; }
        }
      `}</style>
    </>
  );
}

export default function HeroPhotoSection({
  debugClass = "",
}: HeroPhotoSectionProps) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  const HEART_DRAW_MS = 1500;
  const TEXT_IN_DELAY_MS = 300;
  const HOLD_MS = 2000;
  const FADE_OUT_MS = 1500;

  // 페이지 진입 시 위치를 확인하여 스크롤 잠금이 필요한지 판단한다.
  // 사용자가 화면을 내린 채로 새로고침/이전/다음 네비게이션을 하면
  // 브라우저가 그 위치를 복원한다. 이때 잠금하지 않기 위해 `shouldLock`을
  // false로 설정한다.
  const shouldLockRef = useRef(true);

  useLayoutEffect(() => {
    // 초기 브라우저 복원 위치가 5px 이상 내려가 있으면 잠금 안 함
    if (window.scrollY > 5) {
      shouldLockRef.current = false;
      return;
    }

    // 상단에 있으면 스크롤을 맨 위로 고정
    window.scrollTo(0, 0);

    const onPageShow = (e: PageTransitionEvent) => {
      // 매번 pageshow 시에도 위치 확인
      if (window.scrollY > 5) {
        shouldLockRef.current = false;
      } else {
        shouldLockRef.current = true;
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // 스크롤 잠금/해제 로직: 잠금 시 스크롤바 너비만큼 우측 패딩을
  // 추가하여 레이아웃이 좌우로 흔들리는 현상을 막는다.
  const prevOverflow = useRef<string>("");
  const prevPaddingRight = useRef<string>("");

  function lockScroll() {
    // 스크롤바 너비 계산
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.overflow = prevOverflow.current;
    document.body.style.paddingRight = prevPaddingRight.current;
  }

  useEffect(() => {
    // 마운트 시 한 번만 원래 스타일을 저장
    prevOverflow.current = document.body.style.overflow;
    prevPaddingRight.current = document.body.style.paddingRight;

    return () => {
      unlockScroll();
    };
  }, []);

  useEffect(() => {
    // shouldLockRef.current가 false면 스크롤 제어 안 함
    if (!shouldLockRef.current) {
      return;
    }

    // true면 phase에 따라 스크롤 잠금/해제
    if (phase < 3) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [phase]);

  // 타이머를 재시작하는 함수. pageshow 이벤트나 최초 마운트 시 호출된다.
  const timeoutIds = useRef<{ t1?: number; t2?: number; t3?: number }>({});

  function startAnimation() {
    // 상태 및 기존 타이머 초기화
    setPhase(0);
    if (timeoutIds.current.t1) clearTimeout(timeoutIds.current.t1);
    if (timeoutIds.current.t2) clearTimeout(timeoutIds.current.t2);
    if (timeoutIds.current.t3) clearTimeout(timeoutIds.current.t3);

    timeoutIds.current.t1 = window.setTimeout(
      () => setPhase(1),
      HEART_DRAW_MS + TEXT_IN_DELAY_MS,
    );
    timeoutIds.current.t2 = window.setTimeout(
      () => setPhase(2),
      HEART_DRAW_MS + TEXT_IN_DELAY_MS + HOLD_MS,
    );
    timeoutIds.current.t3 = window.setTimeout(
      () => setPhase(3),
      HEART_DRAW_MS + TEXT_IN_DELAY_MS + HOLD_MS + FADE_OUT_MS,
    );
  }

  useEffect(() => {
    startAnimation();
    return () => {
      if (timeoutIds.current.t1) clearTimeout(timeoutIds.current.t1);
      if (timeoutIds.current.t2) clearTimeout(timeoutIds.current.t2);
      if (timeoutIds.current.t3) clearTimeout(timeoutIds.current.t3);
    };
  }, []);

  const introVisible = phase < 3;
  const snowActive = phase >= 1;

  const systemFont =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

  return (
    <section
      className={`relative w-full h-[100dvh] overflow-hidden ${debugClass}`}
      style={{ fontFamily: systemFont }}
    >
      {/* 배경 */}
      <img
        src={mainPhoto}
        alt="웨딩 메인 사진"
        className="absolute inset-0 w-full h-full object-cover transition-all ease-out"
        style={{
          transitionDuration: "1600ms",
          transform: introVisible ? "scale(1.04)" : "scale(1)",
          filter: introVisible
            ? "blur(2px) brightness(0.75)"
            : "blur(0px) brightness(1)",
        }}
      />

      <SnowOverlay active={snowActive} />

      {/* 인트로 오버레이 */}
      <div
        className="absolute inset-0 transition-opacity ease-out"
        style={{
          transitionDuration: `${FADE_OUT_MS}ms`,
          opacity: introVisible ? 1 : 0,
          pointerEvents: introVisible ? "auto" : "none",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />

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
                d="M200 310 C120 250,60 190,60 130 C60 75,95 50,130 50 C160 50,185 65,200 85 C215 65,240 50,270 50 C305 50,340 75,340 130 C340 190,280 250,200 310 Z"
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 1400,
                  strokeDashoffset: phase === 0 ? 1400 : 0,
                  transition: `stroke-dashoffset ${
                    HEART_DRAW_MS + 2500
                  }ms ease-out`,
                }}
              />

              <g
                style={{
                  opacity: phase >= 1 ? 1 : 0,
                  transform: phase >= 1 ? "translateY(0px)" : "translateY(6px)",
                  transition:
                    "opacity 600ms ease-out, transform 600ms ease-out",
                }}
              >
                <text
                  x="200"
                  y="155"
                  textAnchor="middle"
                  fill="white"
                  style={{
                    fontFamily: "cursive",
                    fontStyle: "italic",
                    fontSize: 28,
                  }}
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

      {/* 날짜 + 이름 */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-center"
        style={{
          transform:
            phase >= 3 ? "translate(-50%, 0px)" : "translate(-50%, 8px)",
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 1000ms ease, transform 1000ms ease",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "0.25em",
            fontWeight: 500,
            opacity: 0.85,
          }}
        >
          2027. 01. 16. AM 11:00
        </p>

        <p
          className="mt-2"
          style={{
            fontSize: "18px",
            fontWeight: 600,
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
          opacity: phase >= 3 ? 0.8 : 0,
          letterSpacing: "0.05em",
        }}
      >
        <div className="animate-bounce">↓ Scroll Down ↓</div>
      </div>
    </section>
  );
}
