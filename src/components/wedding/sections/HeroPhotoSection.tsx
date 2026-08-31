/*
  HeroPhotoSection: 메인 사진 + 하트 드로잉 애니메이션
  
  첫 화면 로드 시:
  - 맨 위에 있으면 스크롤 잠금 & 애니메이션 재생
  - 아래로 스크롤된 상태에서 리로드하면 스크롤 잠금 없음
*/
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import weGotMarriedSvg from "@/assets/we-got-married.svg?raw";
import weddingTitleVideo from "@/assets/our-wedding-title.mp4";
import mainPhoto from "@/assets/img/비비엔다2.webp";

type HeroPhotoSectionProps = {
  debugClass?: string;
};

type Star = {
  leftPct: number;
  topPct: number;
  sizePx: number;
  opacity: number;
  durationS: number;
  delayS: number;
  blurPx: number;
  glowPx: number;
};

const introWeddingSvg = weGotMarriedSvg
  // The source artwork has a large empty portrait canvas around the lettering.
  // Crop to the actual paths so the mark, rather than its whitespace, fills the box.
  .replace(/viewBox="[^"]*"/, 'viewBox="105 335 360 165"')
  .replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="xMidYMid meet"')
  .replace(/<path\b/g, '<path pathLength="1"');

const introWeddingStrokeSvg = introWeddingSvg.replace(
  /fill="[^"]*"/g,
  'fill="none"',
);

function StarOverlay({ active }: { active: boolean }) {
  const COUNT = 34;

  const stars = useMemo<Star[]>(() => {
    const seededRand = (seed: number) => {
      const x = Math.sin(seed * 999) * 10000;
      return x - Math.floor(x);
    };
    const rand = (seed: number, min: number, max: number) =>
      min + seededRand(seed) * (max - min);

    return Array.from({ length: COUNT }).map((_, index) => ({
      leftPct: rand(index + 1, 7, 93),
      topPct: rand(index + 31, 8, 82),
      sizePx: rand(index + 61, 3.4, 9.5),
      opacity: rand(index + 91, 0.35, 0.82),
      durationS: rand(index + 121, 2.4, 5.8),
      delayS: -rand(index + 151, 0, 5.8),
      blurPx: rand(index + 181, 0, 0.45),
      glowPx: rand(index + 211, 10, 22),
    }));
  }, []);

  if (!active) return null;

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
        {stars.map((star, i) => (
          <span
            key={i}
            className="hero-star"
            style={
              {
                left: `${star.leftPct}%`,
                top: `${star.topPct}%`,
                "--size": `${star.sizePx}px`,
                "--opacity": star.opacity,
                "--dur": `${star.durationS}s`,
                "--delay": `${star.delayS}s`,
                "--blur": `${star.blurPx}px`,
                "--glow": `${star.glowPx}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <style>{`
        .hero-star{
          position:absolute;
          width: var(--size);
          height: var(--size);
          opacity: 0;
          filter: blur(var(--blur));
          background: linear-gradient(135deg, rgba(255,255,255,1), rgba(255,241,203,0.92));
          clip-path: polygon(50% 0%, 61% 38%, 100% 50%, 61% 62%, 50% 100%, 39% 62%, 0% 50%, 39% 38%);
          box-shadow:
            0 0 var(--glow) rgba(255,255,255,0.82),
            0 0 calc(var(--glow) * 1.8) rgba(255,235,190,0.32);
          transform: translate(-50%, -50%) scale(0.72);
          animation: heroStarTwinkle var(--dur) ease-in-out var(--delay) infinite;
        }

        .hero-star::before,
        .hero-star::after{
          content:"";
          position:absolute;
          inset:50% auto auto 50%;
          width: calc(var(--size) * 5.2);
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.92), transparent);
          transform: translate(-50%, -50%);
          opacity: 0.86;
        }

        .hero-star::after{
          width: 1px;
          height: calc(var(--size) * 5.2);
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.92), transparent);
          transform: translate(-50%, -50%);
        }

        @keyframes heroStarTwinkle{
          0%, 100%{
            opacity: 0.12;
            transform: translate(-50%, -50%) scale(0.72) rotate(0deg);
          }

          42%{
            opacity: var(--opacity);
            transform: translate(-50%, -50%) scale(1.18) rotate(18deg);
          }

          58%{
            opacity: calc(var(--opacity) * 0.55);
            transform: translate(-50%, -50%) scale(0.92) rotate(28deg);
          }
        }

        @media (prefers-reduced-motion: reduce){
          .hero-star{
            opacity: var(--opacity);
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

export function IntroWeddingMark({ drawMs }: { drawMs: number }) {
  const fillDelayMs = Math.max(drawMs - 500, 0);

  return (
    <div className="relative mx-auto w-full max-w-[430px] sm:max-w-[470px]">
      <div
        aria-hidden="true"
        className="intro-wedding-mark intro-wedding-mark-fill"
        dangerouslySetInnerHTML={{ __html: introWeddingSvg }}
      />
      <div
        aria-hidden="true"
        className="intro-wedding-mark intro-wedding-mark-stroke absolute inset-0"
        dangerouslySetInnerHTML={{ __html: introWeddingStrokeSvg }}
      />

      <style>{`
        .intro-wedding-mark{
          opacity: 0;
          filter: blur(10px);
          transform: translateY(8px) scale(0.97);
          animation: introWeddingMarkReveal 850ms cubic-bezier(0.22, 1, 0.36, 1) 120ms forwards;
        }

        .intro-wedding-mark svg{
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .intro-wedding-mark-fill path{
          fill: rgba(255,255,255,0.98) !important;
        }

        .intro-wedding-mark-fill{
          animation:
            introWeddingMarkReveal 850ms cubic-bezier(0.22, 1, 0.36, 1) 120ms forwards,
            introWeddingMarkFillLayer 950ms ease-out ${fillDelayMs}ms forwards;
        }

        .intro-wedding-mark-stroke{
          animation: introWeddingMarkReveal 850ms cubic-bezier(0.22, 1, 0.36, 1) 120ms forwards;
        }

        .intro-wedding-mark-stroke path{
          fill: none !important;
          stroke: rgba(255,255,255,0.98) !important;
          stroke-width: 1.45;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: introWeddingMarkDraw ${drawMs}ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
        }

        @keyframes introWeddingMarkReveal{
          to{
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0) scale(1);
          }
        }

        @keyframes introWeddingMarkDraw{
          to{ stroke-dashoffset: 0; }
        }

        @keyframes introWeddingMarkFillLayer{
          to{
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce){
          .intro-wedding-mark{
            opacity: 1;
            filter: none;
            transform: none;
            animation: none;
          }

          .intro-wedding-mark-fill path{
            fill: rgba(255,255,255,0.98) !important;
          }

          .intro-wedding-mark-stroke path{
            stroke-dashoffset: 0;
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function HeroPhotoSection({
  debugClass = "",
}: HeroPhotoSectionProps) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [mainPhotoReady, setMainPhotoReady] = useState(false);
  const [titleVideoVisible, setTitleVideoVisible] = useState(true);
  const [titleVideoFading, setTitleVideoFading] = useState(false);
  const [lockedViewportHeight, setLockedViewportHeight] = useState<
    number | null
  >(null);

  const MIN_INTRO_SHOW_MS = 2600;
  const FADE_OUT_MS = 700;
  const ENABLE_SCRIPT_TITLE = false;
  const SCRIPT_REVEAL_MS = 2000;
  const titleVideoStartedAtRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

  // 페이지 진입 시 위치를 확인하여 스크롤 잠금이 필요한지 판단한다.
  // 사용자가 화면을 내린 채로 새로고침/이전/다음 네비게이션을 하면
  // 브라우저가 그 위치를 복원한다. 이때 잠금하지 않기 위해 `shouldLock`을
  // false로 설정한다.
  const shouldLockRef = useRef(true);

  useLayoutEffect(() => {
    setLockedViewportHeight(window.innerHeight);
    // 초기 브라우저 복원 위치가 5px 이상 내려가 있으면 잠금 안 함
    if (window.scrollY > 5) {
      shouldLockRef.current = false;
      return;
    }

    // 상단에 있으면 스크롤을 맨 위로 고정
    window.scrollTo(0, 0);

    const onPageShow = () => {
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
  useEffect(() => {
    const updateViewportHeightAfterRotation = () => {
      window.setTimeout(() => {
        setLockedViewportHeight(window.innerHeight);
      }, 300);
    };

    window.addEventListener("orientationchange", updateViewportHeightAfterRotation);

    return () => {
      window.removeEventListener(
        "orientationchange",
        updateViewportHeightAfterRotation,
      );
    };
  }, []);

  const prevOverflow = useRef<string>("");
  const prevPaddingRight = useRef<string>("");

  const clearIntroTimers = useCallback(() => {
    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }

    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const finishIntro = useCallback(() => {
    if (phase >= 3 || titleVideoFading) return;

    const startedAt = titleVideoStartedAtRef.current ?? performance.now();
    titleVideoStartedAtRef.current = startedAt;
    const elapsedMs = performance.now() - startedAt;
    const waitMs = Math.max(MIN_INTRO_SHOW_MS - elapsedMs, 0);

    if (finishTimerRef.current !== null) {
      window.clearTimeout(finishTimerRef.current);
    }

    finishTimerRef.current = window.setTimeout(() => {
      setTitleVideoFading(true);
      finishTimerRef.current = window.setTimeout(() => {
        setTitleVideoVisible(false);
        setPhase(3);
        finishTimerRef.current = null;
      }, FADE_OUT_MS);
    }, waitMs);
  }, [phase, titleVideoFading]);

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
      clearIntroTimers();
    };
  }, [clearIntroTimers]);

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

  // Start a gentle fallback only after the hero photo is available to paint.
  // Kakao's in-app browser can delay video events, so the normal path follows
  // `playing`/`ended` while this keeps the page from getting stuck.
  useEffect(() => {
    if (!mainPhotoReady) return;

    fallbackTimerRef.current = window.setTimeout(() => {
      finishIntro();
    }, 5200);

    return () => {
      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [finishIntro, mainPhotoReady]);

  const introVisible = phase < 3;
  const starActive = phase >= 3;

  const systemFont =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

  return (
    <section
      className={`relative w-full overflow-hidden ${debugClass}`}
      style={{
        fontFamily: systemFont,
        height: lockedViewportHeight ? `${lockedViewportHeight}px` : "100vh",
      }}
    >
      {/* 배경 */}
      <img
        src={mainPhoto}
        alt="웨딩 메인 사진"
        fetchPriority="high"
        decoding="async"
        onLoad={() => setMainPhotoReady(true)}
        className="absolute inset-0 w-full h-full object-cover object-center transition-all ease-out"
        style={{
          transitionDuration: `${FADE_OUT_MS}ms`,
          filter: introVisible
            ? "blur(3px) brightness(0.58)"
            : "blur(0px) brightness(1)",
        }}
      />

      <StarOverlay active={starActive} />

      {/* 인트로 오버레이 */}
      <div
        className="absolute inset-0"
        style={{
          pointerEvents: introVisible ? "auto" : "none",
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center px-2 sm:px-4"
          style={{
            opacity: 1,
          }}
        >
          <div className="relative w-full max-w-[470px]">
            {ENABLE_SCRIPT_TITLE ? (
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  opacity: phase >= 1 ? 1 : 0,
                  transform: phase >= 1 ? "translateY(0px)" : "translateY(8px)",
                  transition:
                    "opacity 700ms ease-out, transform 700ms ease-out",
                }}
              >
                <svg
                  viewBox="0 0 380 360"
                  className="absolute inset-0 h-full w-full overflow-visible"
                  style={{
                    filter: phase >= 1 ? "blur(0px)" : "blur(1.2px)",
                    clipPath:
                      phase >= 1 ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                    transition: `clip-path ${SCRIPT_REVEAL_MS}ms cubic-bezier(0.22, 1, 0.36, 1), filter 900ms ease-out`,
                  }}
                >
                  <path
                    d="M18 114 C40 106, 60 98, 82 92"
                    fill="none"
                    stroke="rgba(255,255,255,0.94)"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 90,
                      strokeDashoffset: phase >= 1 ? 0 : 90,
                      transition: `stroke-dashoffset ${SCRIPT_REVEAL_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                    }}
                  />
                  <text
                    x="95"
                    y="122"
                    fill="rgba(255,255,255,0.97)"
                    style={{
                      fontFamily:
                        "'RememberNight', 'WeddingSignature', cursive",
                      fontSize: "56px",
                      letterSpacing: "0.01em",
                      transform: "rotate(-4deg)",
                      transformOrigin: "95px 122px",
                    }}
                  >
                    We&apos;re getting
                  </text>
                  <text
                    x="86"
                    y="228"
                    fill="rgba(255,255,255,0.99)"
                    style={{
                      fontFamily:
                        "'RememberNight', 'WeddingSignature', cursive",
                      fontSize: "108px",
                      letterSpacing: "-0.01em",
                      transform: "rotate(-4deg)",
                      transformOrigin: "86px 228px",
                    }}
                  >
                    Married!
                  </text>
                  <path
                    d="M62 188 C108 170, 160 172, 214 202"
                    fill="none"
                    stroke="rgba(255,255,255,0.84)"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 180,
                      strokeDashoffset: phase >= 1 ? 0 : 180,
                      transition: `stroke-dashoffset ${SCRIPT_REVEAL_MS + 120}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                    }}
                  />
                  <path
                    d="M34 304 C116 290, 228 292, 346 306"
                    fill="none"
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 340,
                      strokeDashoffset: phase >= 1 ? 0 : 340,
                      transition: `stroke-dashoffset ${SCRIPT_REVEAL_MS + 260}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                    }}
                  />
                </svg>
              </div>
            ) : null}

            {mainPhotoReady && titleVideoVisible ? (
              <video
                className="block h-auto w-full"
                src={weddingTitleVideo}
                autoPlay
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                onLoadedMetadata={(event) => {
                  event.currentTarget.playbackRate = 0.82;
                }}
                onPlaying={() => {
                  titleVideoStartedAtRef.current ??= performance.now();
                }}
                onEnded={() => {
                  finishIntro();
                }}
                onError={() => {
                  finishIntro();
                }}
                style={{
                  mixBlendMode: "screen",
                  opacity: titleVideoFading ? 0 : 1,
                  transform: titleVideoFading
                    ? "translateY(-4px) scale(0.99)"
                    : "translateY(0) scale(1)",
                  transition: `opacity ${FADE_OUT_MS}ms ease, transform ${FADE_OUT_MS}ms ease`,
                }}
              />
            ) : null}
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
