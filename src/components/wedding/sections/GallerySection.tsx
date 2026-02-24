/*
  GallerySection: 사진 슬라이더 (드래그/터치 제스처 지원)
*/
import React, { useEffect, useMemo, useRef, useState } from "react";

type GallerySectionProps = {
  debugClass?: string;
};

import g1 from "@/assets/img/컬러1.png";
import g2 from "@/assets/img/컬러2.png";
import g3 from "@/assets/img/흑백1.png";
import g4 from "@/assets/img/야외컬러2.png";
import g5 from "@/assets/img/야외컬러1.png";

function clampIndex(i: number, len: number) {
  if (len <= 0) return 0;
  return ((i % len) + len) % len;
}

function useInterval(callback: () => void, delay: number | null) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = window.setInterval(() => saved.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
}

function Dots({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="w-2.5 h-2.5 rounded-full transition-all"
          aria-label={`go to slide ${i + 1}`}
          style={{
            backgroundColor: i === activeIndex ? "#9a9a67" : "#d9d9c6",
            transform: i === activeIndex ? "scale(1.05)" : "scale(1)",
          }}
        />
      ))}
    </div>
  );
}

// ✅ 원형 배경 없이 SVG만
function PlayIcon({ isPaused }: { isPaused: boolean }) {
  return isPaused ? (
    // ▶ 재생
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#444"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7-11-7Z" />
    </svg>
  ) : (
    // ⏸ 일시정지
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="#444"
      aria-hidden="true"
    >
      <path d="M6 5h4v14H6V5Zm8 0h4v14h-4V5Z" />
    </svg>
  );
}

// ✅ 원형 배경 없이 SVG 화살표만
function ArrowBtn({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "previous slide" : "next slide"}
      className="absolute top-1/2 -translate-y-1/2 z-20"
      style={{
        left: dir === "left" ? 12 : undefined,
        right: dir === "right" ? 12 : undefined,
      }}
    >
      {dir === "left" ? (
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M15 18 9 12l6-6"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="m9 6 6 6-6 6"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

/**
 * ✅ px 기반 + 드래그(마우스/터치) + 스냅 슬라이더
 * - 클릭 기능 없음
 */
function PeekSlider({
  images,
  index,
  onChange,
  heightPx = 520,
  gapPx = 14,
}: {
  images: string[];
  index: number;
  onChange: (next: number) => void;
  heightPx?: number;
  gapPx?: number;
}) {
  const len = images.length;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [wrapW, setWrapW] = useState(0);

  // 드래그 상태
  const draggingRef = useRef(false);
  const startXRef = useRef(0);

  const [dragDx, setDragDx] = useState(0);
  const [noAnim, setNoAnim] = useState(false);

  // ✅ 컨테이너 너비 측정
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => setWrapW(el.clientWidth));
    ro.observe(el);
    setWrapW(el.clientWidth);

    return () => ro.disconnect();
  }, []);

  // ✅ 풀폭(양옆 안 보이게)
  const slideW = wrapW;

  // ✅ 현재 index에 대한 기본 위치 + 드래그 이동량
  const baseTranslateX = -index * (slideW + gapPx);
  const translateX = baseTranslateX + dragDx;

  const beginDrag = (clientX: number) => {
    if (len <= 1) return;
    draggingRef.current = true;
    startXRef.current = clientX;
    setNoAnim(true);
  };

  const moveDrag = (clientX: number) => {
    if (!draggingRef.current) return;
    const dx = clientX - startXRef.current;
    setDragDx(dx);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const threshold = Math.max(40, slideW * 0.15);
    const dx = dragDx;

    setNoAnim(false);
    setDragDx(0);

    if (Math.abs(dx) < threshold) return;
    if (dx > 0) onChange(clampIndex(index - 1, len));
    else onChange(clampIndex(index + 1, len));
  };

  // 마우스
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    beginDrag(e.clientX);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => moveDrag(e.clientX);
    const onUp = () => endDrag();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slideW, len, dragDx]);

  // 터치
  const onTouchStart = (e: React.TouchEvent) => {
    const x = e.touches[0]?.clientX;
    if (x == null) return;
    beginDrag(x);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0]?.clientX;
    if (x == null) return;
    moveDrag(x);
  };
  const onTouchEnd = () => endDrag();

  return (
    <div ref={wrapRef} className="relative overflow-hidden select-none">
      <ArrowBtn
        dir="left"
        onClick={() => onChange(clampIndex(index - 1, len))}
      />
      <ArrowBtn
        dir="right"
        onClick={() => onChange(clampIndex(index + 1, len))}
      />

      <div
        className="flex cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          gap: `${gapPx}px`,
          transform: `translateX(${translateX}px)`,
          transition: noAnim
            ? "none"
            : "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)" /* 슬라이드 속도 조절 */,
          willChange: "transform",
        }}
      >
        {images.map((src, i) => (
          <div
            key={src + i}
            className="flex-shrink-0"
            style={{ width: `${slideW}px` }}
          >
            <div
              className="rounded-2xl overflow-hidden shadow-sm border border-[#f0f0f0] bg-white"
              style={{ height: `${heightPx}px` }}
            >
              <img
                src={src}
                alt={`gallery ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GallerySection({
  debugClass = "",
}: GallerySectionProps) {
  const images = useMemo(() => [g1, g2, g3, g4, g5], []);
  const [index, setIndex] = useState(0);

  // ✅ 시작은 1번(재생) = paused false
  const [paused, setPaused] = useState(false);

  const len = images.length;

  // ✅ 5초 자동 넘김 (paused면 정지)
  useInterval(
    () => {
      if (len <= 1) return;
      setIndex((cur) => clampIndex(cur + 1, len));
    },
    !paused ? 5000 : null,
  );

  return (
    <section className={`px-6 py-14 bg-white ${debugClass}`}>
      <div className="max-w-[420px] mx-auto relative">
        {/* 타이틀 */}
        <div className="text-center">
          <div className="text-[28px] tracking-[0.18em] text-[#1a1a1a]">
            <span style={{ fontFamily: "'Elsie', serif" }}>GALLERY</span>
          </div>
        </div>

        {/* 우상단 재생/일시정지 (SVG만) */}
        <button
          className="absolute top-0 right-0 p-1"
          onClick={() => setPaused((v) => !v)}
          aria-label={paused ? "play" : "pause"}
        >
          <PlayIcon isPaused={paused} />
        </button>

        {/* 슬라이더 */}
        <div className="mt-10">
          <PeekSlider
            images={images}
            index={index}
            onChange={setIndex}
            heightPx={520}
            gapPx={14}
          />

          <Dots count={len} activeIndex={index} onSelect={setIndex} />
        </div>
      </div>
    </section>
  );
}
