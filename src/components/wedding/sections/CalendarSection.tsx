/*
  CalendarSection: 카운트다운 + 달력 표시
*/
import { useEffect, useMemo, useState } from "react";

type CalendarSectionProps = {
  debugClass?: string;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function buildMonthGrid(year: number, month1to12: number) {
  // month: 1~12
  const first = new Date(year, month1to12 - 1, 1);
  const last = new Date(year, month1to12, 0);
  const daysInMonth = last.getDate();

  // Sunday=0 ... Saturday=6
  const startDow = first.getDay();

  const cells: Array<number | null> = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // 6주(42칸)로 고정 (모바일 레이아웃 안정)
  while (cells.length < 42) cells.push(null);

  return cells;
}

export default function CalendarSection({
  debugClass = "",
}: CalendarSectionProps) {
  // 결혼식 날짜/시간 (KST 고정)
  const target = useMemo(() => new Date("2027-01-16T11:00:00+09:00"), []);

  const [cd, setCd] = useState<Countdown>(() => {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();

      if (diffMs <= 0) {
        setCd({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setCd({ days, hours, minutes, seconds, done: false });
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [target]);

  // 달력: 2027년 1월
  const year = 2027;
  const month = 1;
  const weddingDay = 16;

  const weekLabels = ["일", "월", "화", "수", "목", "금", "토"];
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  // 상단 날짜 문구
  const koDateLine = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Seoul",
    });
    // "2027년 1월 16일 토요일 오전 11:00" 같은 형태
    // 필요하면 아래에서 00 제거해도 됨
    return fmt.format(target).replace(":00", "");
  }, [target]);

  const enDateLine = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Seoul",
    });
    return fmt.format(target).replace(":00", "");
  }, [target]);

  return (
    <section className={`px-6 py-10 bg-white ${debugClass}`}>
      <div className="max-w-[420px] mx-auto">
        {/* Title */}
        <div className="text-center">
          <div
            style={{ fontFamily: "'Elsie', serif" }}
            className="text-[28px] tracking-[0.08em] text-[#1a1a1a]"
          >
            WEDDING DAY
          </div>

          <div className="mt-5 text-[14px] text-[#3a3a3a] mb-2">
            {koDateLine}시
          </div>
          <div className="mt-1 text-[15px] text-[#9a9a9a]">{enDateLine}</div>

          <div className="mt-8 h-px bg-[#e7e7e7]" />
        </div>

        {/* Calendar */}
        <div className="mt-8">
          {/* Week header */}
          <div className="grid grid-cols-7 text-center text-[13px] font-medium">
            {weekLabels.map((w, i) => (
              <div
                key={w}
                className={`${i === 0 ? "text-red-400" : "text-[#1a1a1a]"}`}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="mt-6 grid grid-cols-7 gap-y-6 text-center text-[14px]">
            {grid.map((day, idx) => {
              const dow = idx % 7; // 0=Sun
              const isSunday = dow === 0;
              const isWedding = day === weddingDay;

              return (
                <div key={idx} className="h-8 flex items-center justify-center">
                  {day === null ? null : (
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full
                        ${isWedding ? "bg-[#7a7a7a] text-white" : ""}
                        ${!isWedding && isSunday ? "text-red-400" : ""}
                        ${!isWedding && !isSunday ? "text-[#1a1a1a]" : ""}
                      `}
                    >
                      {day}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 h-px bg-[#e7e7e7]" />
        </div>

        {/* Countdown cards */}
        <div className="mt-10 grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-white shadow-sm border border-[#efefef] py-5 text-center">
            <div className="text-[26px] text-[#111]">{cd.days}</div>
            <div className="mt-1 text-[11px] tracking-[0.12em] text-[#9a9a9a]">
              DAYS
            </div>
          </div>
          <div className="rounded-xl bg-white shadow-sm border border-[#efefef] py-5 text-center">
            <div className="text-[26px] text-[#111]">{pad2(cd.hours)}</div>
            <div className="mt-1 text-[11px] tracking-[0.12em] text-[#9a9a9a]">
              HOURS
            </div>
          </div>
          <div className="rounded-xl bg-white shadow-sm border border-[#efefef] py-5 text-center">
            <div className="text-[26px] text-[#111]">{pad2(cd.minutes)}</div>
            <div className="mt-1 text-[11px] tracking-[0.12em] text-[#9a9a9a]">
              MINUTES
            </div>
          </div>
          <div className="rounded-xl bg-white shadow-sm border border-[#efefef] py-5 text-center">
            <div className="text-[26px] text-[#111]">{pad2(cd.seconds)}</div>
            <div className="mt-1 text-[11px] tracking-[0.12em] text-[#9a9a9a]">
              SECONDS
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-6 text-center text-[14px] text-[#2a2a2a]">
          {cd.done ? (
            <span>오늘이 결혼식 당일입니다 🤍</span>
          ) : (
            <span>
              세인❤화진 결혼식이 <b className="font-semibold">{cd.days}</b>일
              남았습니다
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
