import groomImg from "../../../assets/img/어린_이세인.png"; 
import brideImg from "../../../assets/img/어린_유화진.png";

type BrideGroomSectionProps = {
  debugClass?: string;
};

type PersonCard = {
  roleLabel: "신랑" | "신부";
  roleColorClass: string; // text-blue-400 / text-pink-400 같은
  name: string;
  tel?: string; // "010-1234-5678"
  imageSrc: string;

  birth: string; // "93년 8월 3일"
  region: string; // "서울 강동구"
  job: string; // "IT 개발자"
  jobEmoji?: string; // "💻"

  pledge: string; // "저희 행복하게" / "잘 살겠습니다:)"
  familyLine: string; // "김종혁·최은혜의 장남"
};

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="inline-block"
      aria-hidden="true"
    >
      <path
        d="M6.6 10.8c1.4 2.7 3.9 5.2 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2.1.7 3.2.7.7 0 1.2.5 1.2 1.2V20c0 .7-.5 1.2-1.2 1.2C10.4 21.2 2.8 13.6 2.8 4.2 2.8 3.5 3.3 3 4 3h2.7c.7 0 1.2.5 1.2 1.2 0 1.1.2 2.2.7 3.2.1.4 0 .9-.2 1.2l-2.1 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AboutUsSection({ debugClass = "" }: BrideGroomSectionProps) {
  const groom: PersonCard = {
    roleLabel: "신랑",
    roleColorClass: "text-sky-400",
    name: "이세인",
    tel: "010-3100-7025", // 너 번호로 교체
    imageSrc: groomImg,

    birth: "93년 8월 3일",
    region: "인천 부평",
    job: "IT 개발자",
    jobEmoji: "💻",

    pledge: "저희 행복하게",
    familyLine: "이상권·박선욱의 장남",
  };

  const bride: PersonCard = {
    roleLabel: "신부",
    roleColorClass: "text-rose-400",
    name: "유화진",
    tel: "010-4032-5936", // 너 번호로 교체
    imageSrc: brideImg,

    birth: "99년 8월 12일",
    region: "인천 도원",
    job: "웨딩 마케터",
    jobEmoji: "🎨",

    pledge: "잘 살겠습니다:)",
    familyLine: "ooo·ooo의 차녀",
  };

  const cards = [groom, bride];

  return (
    <section className={`px-6 py-10 bg-white ${debugClass}`}>
      <div className="max-w-[420px] mx-auto">
        {/* 소개합니다 */}
        <div className="text-center mb-10">
          <div
            style={{ fontFamily: "'Elsie', serif" }}
            className="text-[28px] tracking-[0.08em] text-[#1a1a1a]"
          >
            ABOUT US
          </div>
        </div>

        <div className="rounded-2xl border border-[#ededed] bg-white shadow-sm overflow-hidden">
          {/* 상단: 사진 2장 */}
          <div className="grid grid-cols-2 gap-4 p-4">
            {cards.map((p) => (
              <div key={p.roleLabel} className="rounded-xl overflow-hidden bg-[#f6f6f6]">
                <img
                  src={p.imageSrc}
                  alt={`${p.roleLabel} ${p.name}`}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* 중단: 정보 2열 */}
          <div className="grid grid-cols-2 px-4 pb-5">
            {cards.map((p) => (
              <div key={p.roleLabel} className="text-center px-2">
                {/* 역할/이름/전화 */}
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className={`${p.roleColorClass} text-[13px] font-medium`}>
                    {p.roleLabel}
                  </span>
                  <span className="text-[15px] text-[#1a1a1a] font-medium">{p.name}</span>

                  {p.tel ? (
                    <a
                      href={`tel:${p.tel.replaceAll("-", "")}`}
                      className="text-[#2f7a4b] hover:opacity-80 active:opacity-70"
                      aria-label={`${p.roleLabel} ${p.name} 전화걸기`}
                    >
                      <PhoneIcon />
                    </a>
                  ) : null}
                </div>

                {/* 상세 정보 */}
                <div className="mt-5 space-y-2 text-[14px] text-[#2b2b2b] leading-relaxed">
                  <div>{p.birth}</div>
                  <div>{p.region}</div>
                  <div>
                    {p.job} {p.jobEmoji ? <span className="ml-1">{p.jobEmoji}</span> : null}
                  </div>
                </div>

                {/* 가운데 약속 문구 */}
                <div className="mt-10 text-[14px] text-[#2b2b2b]">
                  {p.pledge}
                </div>

                {/* 하단 가족 관계 */}
                <div className="mt-6 text-[12.5px] text-[#8b8b8b]">
                  {p.familyLine}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}