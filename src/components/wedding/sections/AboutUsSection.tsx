/*
  AboutUsSection: 신랑/신부 상세 프로필 (MBTI, 서약)
*/
import { Phone } from "lucide-react";

type BrideGroomSectionProps = {
  debugClass?: string;
};

type PersonCard = {
  roleLabel: "신랑" | "신부";
  name: string;
  tel?: string; // "010-1234-5678"

  birth: string; // "93년 8월 3일"
  region: string; // "서울 강동구"

  mbti: string;
  pledge: string;
};

export default function AboutUsSection({
  debugClass = "",
}: BrideGroomSectionProps) {
  const groom: PersonCard = {
    roleLabel: "신랑",
    name: "이세인",
    tel: "010-3100-7025", // 너 번호로 교체

    birth: "1998년 09월 26일",
    region: "인천",
    mbti: "ESFJ",
    pledge: "든든한 남편이 되겠습니다.",
  };

  const bride: PersonCard = {
    roleLabel: "신부",
    name: "유화진",
    tel: "010-4032-5936", // 너 번호로 교체

    birth: "1999년 08월 12일",
    region: "인천",

    mbti: "ISTJ",
    pledge: "따뜻한 아내가 되겠습니다.",
  };

  const cards = [groom, bride];

  return (
    <section className={`bg-[#fafafa] px-6 py-14 ${debugClass}`}>
      <div className="max-w-[420px] mx-auto">
        {/* 소개합니다 */}
        <div className="text-center mb-10">
          <p
            style={{ fontFamily: "'Elsie', serif" }}
            className="text-[13px] text-[#9b948b]"
          >
            PROFILE
          </p>
          <h2 className="mt-3 text-[20px] font-normal text-[#333]">
            두 사람을 소개합니다.
          </h2>
        </div>

          <div className="grid grid-cols-2 gap-4">
            {cards.map((p) => (
              <div key={p.roleLabel} className="min-w-0 text-center">
                {/* 역할/이름/전화 */}
                <div className="flex min-h-10 items-center justify-center gap-2 border-b border-[#dedede] pb-3">
                  <span
                    className="text-[12px] text-[#888]"
                  >
                    {p.roleLabel}
                  </span>
                  <span className="text-[18px] text-[#333]">
                    {p.name}
                  </span>

                  {p.tel ? (
                    <a
                      href={`tel:${p.tel.replaceAll("-", "")}`}
                      className="shrink-0 text-[#999] hover:text-[#555]"
                      aria-label={`${p.roleLabel} ${p.name} 전화걸기`}
                      title={`${p.name} 전화걸기`}
                    >
                      <Phone size={13} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>

                {/* 상세 정보 */}
                <div className="mt-4 space-y-1 text-[12.5px] leading-relaxed text-[#777]">
                  <div>{p.birth}</div>
                  <div>{p.region}</div>
                </div>

                {/* MBTI */}
                <div className="mt-1 text-[13px] text-[#777]">
                  #{p.mbti}
                </div>

                {/* 약속 문구 */}
                <div className="mt-8 break-keep text-balance text-[12.5px] leading-relaxed text-[#777]">
                  {p.pledge}
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
