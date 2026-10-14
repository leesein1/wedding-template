/*
  LocationSection
  → 예식장 위치, 교통 정보, 카카오 지도 등을 렌더링하는 섹션입니다.
  MainWedding에서 순서에 맞게 배치되며, 독립적인 상태와 로직을 가집니다.
*/
import React, { useEffect, useRef, useState } from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (
          container: HTMLElement,
          options: { center: unknown; level: number },
        ) => {
          setDraggable?: (v: boolean) => void;
          setZoomable?: (v: boolean) => void;
          relayout?: () => void;
        };
        Marker: new (options: { position: unknown }) => {
          setMap: (map: unknown) => void;
        };
      };
    };
  }
}

type LocationSectionProps = { debugClass?: string };

const VENUE = {
  name: "그레이스파티 인천점",
  address: "인천 부평구 광장로 16",
  lat: 37.4896,
  lng: 126.7248,
};

const GUIDE = {
  location: {
    title: "찾아오시는 길",
    lines: [
      "인천 부평구 광장로 16",
      "부평역사쇼핑몰 5층 그레이스파티 인천점"
    ],
  },
  bus: {
    title: "버스",
    items: [
      {
        badge: "파랑(간선)",
        lines: ["1, 2, 10, 11, 12, 23, 24-1, 30, 34, 35, 40"],
      },
      {
        badge: "초록(지선)",
        lines: ["551, 552, 555, 556, 557, 558, 560, 561"],
      },
    ],
  },
  subway: {
    title: "지하철",
    items: [
      { badge: "1호선 · 인천 1호선", lines: ["부평역 하차"] }
    ]
  },
  parking: {
    title: "주차 안내",
    lines: [
      {
        label: "역사 주차장:",
        text: "부평역 광장 우측 대아골프랜드 주차장",
      },
      {
        label: "롯데마트 주차장:",
        text: "부평역 광장 좌측 롯데마트 주차장",
      },
      {
        label: "",
        text: "웨딩홀에서 '주차 확인'을 받아가세요. (2시간 무료)",
      },
    ],
  },
  notice: "※ 교통이 혼잡하오니 대중교통을 이용하시면 편리합니다.",
};

function Icon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e8e8] bg-white shadow-[0_6px_14px_rgba(0,0,0,0.06)]"
      aria-label={label}
      title={label}
    >
      {children}
    </span>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 19.5h11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7 19.5v1.2M17 19.5v1.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7 3.7h10c1.5 0 2.5 1.2 2.5 2.7v10.1c0 1.7-1.3 3-3 3H7.5c-1.7 0-3-1.3-3-3V6.4C4.5 4.9 5.5 3.7 7 3.7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M6.7 7h10.6M6.7 10.2h10.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.2 15.9a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM15.8 15.9a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SubwayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 20.3l-1 1.3M16 20.3l1 1.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8 3.7h8c1.8 0 3 1.3 3 3v9.8c0 2.2-1.8 4-4 4H9c-2.2 0-4-1.8-4-4V6.7c0-1.7 1.2-3 3-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M7.4 8.2h9.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M10 15.8h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9.2 17.8a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2ZM14.8 17.8a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 3.8h8.2c2.6 0 4.8 2 4.8 4.6s-2.2 4.6-4.8 4.6H6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 3.8v16.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M5 21h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GuideHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="text-[14px] font-semibold text-[#1a1a1a]">{title}</div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#e2e2e2] bg-white px-2 py-[2px] text-[12px] text-[#333]">
      {text}
    </span>
  );
}

export default function LocationSection({
  debugClass = "",
}: LocationSectionProps) {
  const { ref, isVisible: isNearViewport } = useRevealOnScroll({ rootMargin: "800px 0px", threshold: 0 });
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState(() => import.meta.env.VITE_KAKAO_MAP_JS_KEY ? "" : "VITE_KAKAO_MAP_JS_KEY가 설정되지 않았습니다.");

  useEffect(() => {
    if (!isNearViewport) return;
    const key = import.meta.env.VITE_KAKAO_MAP_JS_KEY as string | undefined;
    if (!key) return;

    const renderMap = () => {
      if (!window.kakao?.maps || !mapRef.current) return;

      window.kakao.maps.load(() => {
        if (!mapRef.current || !window.kakao?.maps) return;

        const center = new window.kakao.maps.LatLng(VENUE.lat, VENUE.lng);
        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 3,
        });
        map.setDraggable?.(true);
        map.setZoomable?.(true);

        const marker = new window.kakao.maps.Marker({ position: center });
        marker.setMap(map);

        setTimeout(() => map.relayout?.(), 120);
      });
    };

    if (window.kakao?.maps) {
      renderMap();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-maps-sdk="true"]',
    );

    const onLoad = () => renderMap();
    const onErr = () => setError("카카오맵 스크립트를 불러오지 못했습니다.");

    if (!script) {
      script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
      script.async = true;
      script.dataset.kakaoMapsSdk = "true";
      document.head.appendChild(script);
    }

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onErr);

    return () => {
      script?.removeEventListener("load", onLoad);
      script?.removeEventListener("error", onErr);
    };
  }, [isNearViewport]);

  return (
    <section ref={ref} className={`px-6 py-10 bg-white ${debugClass}`}>
      <div className="max-w-[420px] mx-auto">
        <div className="text-center">
          {/* ✅ LOCATION만 Elsie */}
          <div
            style={{ fontFamily: "'Elsie', serif" }}
            className="text-[28px] tracking-[0.08em] text-[#1a1a1a]"
          >
            LOCATION
          </div>

          {/* ✅ 나머지는 전역 system 폰트 상속 */}
          <p className="mt-5 text-[15px] text-[#2a2a2a]">{VENUE.name}</p>
          <p className="mt-2 text-[13px] text-[#6b6b6b]">{VENUE.address}</p>
        </div>

        <div className="relative z-20 mt-6 overflow-hidden rounded-2xl border border-[#ebebeb] shadow-[0_18px_35px_rgba(0,0,0,0.06)]">
          <div
            ref={mapRef}
            className="h-[260px] w-full bg-[#f6f6f6]"
            style={{
              pointerEvents: "auto",
              touchAction: "pan-x pan-y",
            }}
          />
        </div>

        {error ? (
          <p className="mt-3 text-[12px] text-red-500">{error}</p>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <a
            href={`https://map.kakao.com/link/map/${encodeURIComponent(VENUE.name)},${VENUE.lat},${VENUE.lng}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-[#dedede] bg-white px-4 text-[13px] text-[#2a2a2a] shadow-[0_10px_22px_rgba(0,0,0,0.06)] hover:bg-[#f8f8f8]"
          >
            카카오맵에서 길찾기
          </a>
          <a
            href={`https://map.kakao.com/link/to/${encodeURIComponent(VENUE.name)},${VENUE.lat},${VENUE.lng}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#dedede] bg-white px-4 text-[13px] text-[#2a2a2a] shadow-[0_10px_22px_rgba(0,0,0,0.06)] hover:bg-[#f8f8f8]"
          >
            길안내 시작
          </a>
        </div>

        <div className="mt-9 space-y-8 text-[13px] leading-relaxed text-[#2a2a2a]">
          <div className="rounded-2xl border border-[#efefef] bg-[#fcfcfc] p-4 shadow-[0_14px_26px_rgba(0,0,0,0.05)]">
            <GuideHeader
              icon={
                <Icon label="식장 위치">
                  <PinIcon />
                </Icon>
              }
              title={GUIDE.location.title}
            />
            <div className="mt-3 space-y-1 text-[#444]">
              {GUIDE.location.lines.map((t, i) => (
                <p key={i}>
                  {t === "부평역사쇼핑몰 5층 그레이스파티 인천점" ? (
                    <strong className="font-bold">{t}</strong>
                  ) : t}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#efefef] bg-[#fcfcfc] p-4 shadow-[0_14px_26px_rgba(0,0,0,0.05)]">
            <GuideHeader
              icon={
                <Icon label="bus">
                  <BusIcon />
                </Icon>
              }
              title={GUIDE.bus.title}
            />
            <div className="mt-3 space-y-4 text-[#444]">
              {GUIDE.bus.items.map((it, idx) => (
                <div key={idx} className="space-y-1">
                  <Badge text={it.badge} />
                  <div className="mt-2 space-y-1">
                    {it.lines.map((t, i) => (
                      <p key={i}>{t}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#efefef] bg-[#fcfcfc] p-4 shadow-[0_14px_26px_rgba(0,0,0,0.05)]">
            <GuideHeader
              icon={
                <Icon label="subway">
                  <SubwayIcon />
                </Icon>
              }
              title={GUIDE.subway.title}
            />
            <div className="mt-3 space-y-2 text-[#444]">
              {GUIDE.subway.items.map((it, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="shrink-0">
                    <Badge text={it.badge} />
                  </span>
                  <div className="min-w-0 space-y-1">
                    {it.lines.map((t, i) => (
                      <p key={i}>{t}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#efefef] bg-[#fcfcfc] p-4 shadow-[0_14px_26px_rgba(0,0,0,0.05)]">
            <GuideHeader
              icon={
                <Icon label="parking">
                  <ParkingIcon />
                </Icon>
              }
              title={GUIDE.parking.title}
            />
            <div className="mt-3 space-y-1 text-[#444]">
              {GUIDE.parking.lines.map((line, i) => (
                <p key={i} className={line.label ? undefined : "pt-[1.625em]"}>
                  {line.label ? (
                    <><strong className="font-bold">{line.label}</strong>{" "}</>
                  ) : null}
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-[12px] font-bold leading-relaxed text-[#6b6b6b]">
          {GUIDE.notice}
        </p>

        <div className="h-2" />
      </div>
    </section>
  );
}
