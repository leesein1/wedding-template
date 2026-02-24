/*
  CoupleInfoSection: 신랑/신부 간단 소개 (리본 + 텍스트)
*/
type CoupleInfoSectionProps = {
  debugClass?: string;
};

export default function CoupleInfoSection({
  debugClass = "",
}: CoupleInfoSectionProps) {
  return (
    <section className={`px-8 py-16 text-center ${debugClass}`}>
      {/* 🎀 리본 */}
      <div className="flex justify-center mb-10">
        <svg
          width="72"
          height="42"
          viewBox="0 0 120 70"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="
              M60 35
              C 50 22, 30 18, 20 30
              C 12 40, 24 50, 38 44
              C 50 39, 54 36, 60 35

              C 66 36, 70 39, 82 44
              C 96 50, 108 40, 100 30
              C 90 18, 70 22, 60 35

              M38 44
              C 44 52, 52 55, 60 48

              M82 44
              C 76 52, 68 55, 60 48
            "
            fill="none"
            stroke="#b5a99a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 📜 시 */}
      <div
        className="leading-9 text-[15px]"
        style={{
          color: "#6f6a63",
          letterSpacing: "0.02em",
        }}
      >
        <p>사람이 온다는 건 실은 어마어마한 일이다.</p>
        <p className="mt-5">그는 그의 과거와 현재와 그리고</p>
        <p>그의 미래와 함께 오기 때문이다.</p>
        <p className="mt-5">한 사람의 일생이 오기 때문이다.</p>

        <p className="mt-8 text-sm" style={{ color: "#9b948b" }}>
          - 정현종, 「방문객」
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
