/*
  LocationSection
  → 예식장 위치, 교통 정보, 카카오 지도 등을 렌더링하는 섹션입니다.
  MainWedding에서 순서에 맞게 배치되며, 독립적인 상태와 로직을 가집니다.
*/
import React, { useEffect, useRef, useState } from "react";

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
  name: "부평역 그레이스파티",
  address: "인천 부평구 광장로 16",
  lat: 37.4896,
  lng: 126.7248,
};

const GUIDE = {
  car: {
    title: "자차",
    lines: [
      "내비게이션 : '부평역 그레이스파티' 검색",
      "인천 부평구 광장로 16 부평역 그레이스파티",
    ],
  },
  bus: {
    title: "버스",
    items: [
      { badge: "예시", lines: ["부평역 정류장 하차", "도보 ○분"] },
      { badge: "예시", lines: ["부평역(지하상가) 하차", "○○ 방향 → 도보 ○분"] },
    ],
  },
  subway: {
    title: "지하철",
    items: [
      { badge: "1호선", lines: ["부평역 하차", "○번 출구 → 도보 ○분"] },
      { badge: "인천1호선", lines: ["부평역 하차", "○번 출구 → 도보 ○분"] },
    ],
  },
  parking: {
    title: "주차",
    lines: [
      "주차 : 건물 내/인근 주차장 이용",
      "하객 주차 지원 : ○시간 무료 (예식장 안내 기준)",
      "주차 현장 주차 요원 안내를 받아주세요.",
    ],
  },
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

function CarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3.5 14.5v-3.2c0-.8.5-1.5 1.3-1.8l2.7-1 1.5-3.1c.3-.6.9-1 1.6-1h6.8c.7 0 1.3.4 1.6 1l1.5 3.1 2.7 1c.8.3 1.3 1 1.3 1.8v3.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 14.5h11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6.8 18.8a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM17.2 18.8a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3.5 14.5v2.1c0 .9.7 1.6 1.6 1.6h1.2M19.1 18.2h1.2c.9 0 1.6-.7 1.6-1.6v-2.1"
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
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const key = import.meta.env.VITE_KAKAO_MAP_JS_KEY as string | undefined;
    if (!key) {
      setError("VITE_KAKAO_MAP_JS_KEY가 설정되지 않았습니다.");
      return;
    }

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

        setTimeout(() => (map as any)?.relayout?.(), 120);
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
  }, []);

  return (
    <section className={`px-6 py-10 bg-white ${debugClass}`}>
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
                <Icon label="car">
                  <CarIcon />
                </Icon>
              }
              title={GUIDE.car.title}
            />
            <div className="mt-3 space-y-1 text-[#444]">
              {GUIDE.car.lines.map((t, i) => (
                <p key={i}>{t}</p>
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
            <div className="mt-3 space-y-4 text-[#444]">
              {GUIDE.subway.items.map((it, idx) => (
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
                <Icon label="parking">
                  <ParkingIcon />
                </Icon>
              }
              title={GUIDE.parking.title}
            />
            <div className="mt-3 space-y-1 text-[#444]">
              {GUIDE.parking.lines.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="h-2" />
      </div>
    </section>
  );
}
