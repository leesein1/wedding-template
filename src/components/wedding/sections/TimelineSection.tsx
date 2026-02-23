import { useEffect, useMemo, useRef, useState } from "react";

// 이미지 변경 필요
import t1 from "../../../assets/img/반지사진1.jpg";
import t2 from "../../../assets/img/반지사진1.jpg";
import t3 from "../../../assets/img/반지사진1.jpg";
import t4 from "../../../assets/img/반지사진1.jpg";

type TimelineSectionProps = { debugClass?: string };

type TimelineItem = {
  id: string;
  side: "left" | "right"; // left: 왼쪽 이미지/오른쪽 글, right: 반대
  title: string;
  body: Array<{ text: string; highlight?: boolean }>;
  image: string;
};

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="px-[2px]"
      style={{ background: "linear-gradient(transparent 62%, #F6E8B1 62%)" }}
    >
      {children}
    </span>
  );
}

function BodyLines({ body }: { body: TimelineItem["body"] }) {
  return (
    <div className="mt-3 text-[14px] leading-7 text-[#4a4a4a] whitespace-pre-line">
      {body.map((b, i) =>
        b.highlight ? <Highlight key={i}>{b.text}</Highlight> : <span key={i}>{b.text}</span>
      )}
    </div>
  );
}

function TimelineRow({
  item,
  visible,
  setSentinelRef,
}: {
  item: TimelineItem;
  visible: boolean;
  setSentinelRef: (el: HTMLDivElement | null) => void;
}) {
  const imageEl = (
    <img
      src={item.image}
      alt={item.title}
      className="w-[150px] h-[150px] rounded-2xl object-cover shadow-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(14px)",
        transition: "opacity 900ms ease, transform 900ms ease",
        willChange: "opacity, transform",
      }}
      loading="lazy"
    />
  );

  const textEl = (
    <div
      className="max-w-[170px] text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(12px)",
        transition: "opacity 900ms ease 80ms, transform 900ms ease 80ms",
        willChange: "opacity, transform",
      }}
    >
      <div className="text-[15px] text-[#2a2a2a]">{item.title}</div>
      <BodyLines body={item.body} />
    </div>
  );

  const left = item.side === "left" ? imageEl : textEl;
  const right = item.side === "left" ? textEl : imageEl;

  return (
    <div className="relative grid grid-cols-[1fr_24px_1fr] items-center gap-4 py-12">
      {/* ✅ 센티넬: 이 줄이 화면에 들어오면 “다음 아이템 오픈” 조건으로 사용 */}
      <div ref={setSentinelRef} className="absolute left-0 right-0 top-[45%] h-[1px]" />

      <div className="flex justify-center">{left}</div>

      <div className="flex justify-center">
        <div
          className="w-3 h-3 rounded-full bg-[#3b4f3b]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.6)",
            transition: "opacity 700ms ease, transform 700ms ease",
            willChange: "opacity, transform",
          }}
        />
      </div>

      <div className="flex justify-center">{right}</div>
    </div>
  );
}

export default function TimelineSection({ debugClass = "" }: TimelineSectionProps) {
  const items: TimelineItem[] = useMemo(
    () => [
      {
        id: "first",
        side: "left",
        title: "첫 만남",
        body: [
          { text: "저희는 발리에서\n" },
          { text: "처음", highlight: true },
          { text: " 만났어요." },
        ],
        image: t1,
      },
      {
        id: "one-year",
        side: "right",
        title: "1주년",
        body: [
          { text: "함께한 1년", highlight: true },
          { text: "\n서로를 알아가는 시간이었어요." },
        ],
        image: t2,
      },
      {
        id: "two-year",
        side: "left",
        title: "2주년",
        body: [
          { text: "함께한 2년", highlight: true },
          { text: "\n우리는 결혼을 결심했어요." },
        ],
        image: t3,
      },
      {
        id: "wedding",
        side: "right",
        title: "WeddingDay",
        body: [
          { text: "저희는 이날 " },
          { text: "결혼", highlight: true },
          { text: "해요.\n저희의 시작을\n축하해주세요." },
        ],
        image: t4,
      },
    ],
    []
  );

  // ✅ 여기서 “현재까지 열린 최대 인덱스”를 관리
  const [maxVisibleIndex, setMaxVisibleIndex] = useState(0);

  // 센티넬 refs 저장
  const sentinelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        // entry가 들어온 것들 중 가장 “앞 인덱스 다음”만 열리게
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const idx = Number((entry.target as HTMLElement).dataset["idx"] || "-1");
          if (idx < 0) continue;

          // ✅ 핵심: 순서대로만 증가 (1개씩)
          setMaxVisibleIndex((cur) => {
            // 다음으로 열 수 있는 건 cur+1까지만
            // ex) cur=0이면 1까지만 열어줌
            const nextAllowed = cur + 1;
            if (idx <= nextAllowed) return Math.max(cur, idx);
            return cur;
          });
        }
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px -20% 0px", // 살짝 내려오면 다음 트리거
      }
    );

    // 관찰 등록
    sentinelRefs.current.forEach((el, idx) => {
      if (!el) return;
      el.dataset.idx = String(idx);
      io.observe(el);
    });

    return () => io.disconnect();
  }, [items.length]);

  return (
    <section className={`px-6 py-14 bg-white ${debugClass}`}>
      <div className="max-w-[420px] mx-auto">
        <div style={{ fontFamily: "'Elsie', serif" }}
        className="text-center text-[28px] text-[#1a1a1a]"
        >
          OUR TIMELINE
        </div>

        {/* 라인(안 끊김) */}
        <div className="relative mt-10">
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#e7e7e7]"
            aria-hidden
          />

          {items.map((it, idx) => (
            <TimelineRow
              key={it.id}
              item={it}
              visible={idx <= maxVisibleIndex}
              setSentinelRef={(el) => {
                sentinelRefs.current[idx] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}