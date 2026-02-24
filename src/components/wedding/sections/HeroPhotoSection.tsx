import { useEffect, useMemo, useRef, useState } from "react";
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

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), HEART_DRAW_MS + TEXT_IN_DELAY_MS);
    const t2 = setTimeout(
      () => setPhase(2),
      HEART_DRAW_MS + TEXT_IN_DELAY_MS + HOLD_MS,
    );
    const t3 = setTimeout(
      () => setPhase(3),
      HEART_DRAW_MS + TEXT_IN_DELAY_MS + HOLD_MS + FADE_OUT_MS,
    );

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
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
