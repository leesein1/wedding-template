/*
  CoupleInfoSection: 신랑/신부 간단 소개
*/
type CoupleInfoSectionProps = {
  debugClass?: string;
};

export default function CoupleInfoSection({
  debugClass = "",
}: CoupleInfoSectionProps) {
  return (
    <section className={`px-8 py-16 text-center ${debugClass}`}>
      {/*
      <div aria-hidden="true" className="mb-10 flex h-6 items-center justify-center gap-3">
        <span className="h-1 w-1 rounded-full bg-[#b5a99a]" />
        <span className="h-1 w-1 rounded-full bg-[#b5a99a]" />
        <span className="h-1 w-1 rounded-full bg-[#b5a99a]" />
      </div>
      */}
      <h2
        aria-label="INVITATION"
        className="mb-10 text-[13px] leading-6 text-[#9b948b]"
        style={{ fontFamily: "'Elsie', serif" }}
      >
        <span aria-hidden="true" className="inline-flex gap-[1.5px]">
          {"INVITATION".split("").map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </span>
      </h2>

      {/* 📜 시 */}
      <div
        className="leading-9 text-[15px]"
        style={{
          color: "#6f6a63",
          letterSpacing: "0.02em",
        }}
      >
        <blockquote>
          <p className="-skew-x-[8deg]">때론 오래된 친구처럼</p>
          <p className="-skew-x-[8deg]">때론 처음 만나는 사람처럼</p>
          <p className="-skew-x-[8deg]">그 많은 당신을 다 사랑하고 싶습니다.</p>
        </blockquote>

        <p className="mt-8 text-sm" style={{ color: "#9b948b" }}>
          - 이준호, 「사랑고백」
        </p>
      </div>

      {/* ✨ 초대 문구 */}
      <div
        className="mt-14 leading-9 text-[15px]"
        style={{
          color: "#6f6a63",
          letterSpacing: "0.02em",
        }}
      >
        <p>저희 두 사람이 함께하는 새로운 시작에</p>
        <p>귀한 발걸음으로 축복해 주시면 감사하겠습니다.</p>
      </div>

      {/* 💍 이름 */}
      <div className="mt-16">
        <p
          className="text-lg"
          style={{
            letterSpacing: "0.08em",
            color: "#4d4742",
          }}
        >
          신랑 이세인 · 신부 유화진
        </p>
      </div>
    </section>
  );
}
