import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import groomPhoto from "@/assets/img/어린_이세인.png";
import bridePhoto from "@/assets/img/bride-childhood.webp";

type InterviewSectionProps = { debugClass?: string };

type AnswerLine = {
  text: string;
  highlight?: boolean;
};

type Answer = {
  speaker: "groom" | "bride" | "both";
  lines: AnswerLine[];
};

type InterviewItem = {
  question: string;
  answers: Answer[];
};

const items: InterviewItem[] = [
  {
    question: "두 사람의 인연은 언제부터 시작되었나요?",
    answers: [
      {
        speaker: "both",
        lines: [
          { text: "사실 저희의 인연은 아주 오래전, 유치원 시절부터 시작되었습니다." },
          { text: "함께 찍은 사진도 남아 있지만,\n정작 그때의 기억은 서로 희미합니다." },
          { text: "어린 시절 스쳐 지나간 인연이 시간이 흘러 다시 만나,\n평생을 함께할 인연이 되었습니다." },
        ],
      },
    ],
  },
  {
    question: "결혼을 결심하게 된 순간은?",
    answers: [
      {
        speaker: "groom",
        lines: [
          { text: "늘 겁이 많고 도전을 망설이던 저에게\n화진이는 한 걸음 나아갈 용기를 줬어요." },
          { text: "이 사람과 함께라면 더 나은 사람이 되고,\n더 열심히 살아갈 수 있겠다는 확신이 들었어요." },
        ],
      },
      {
        speaker: "bride",
        lines: [
          { text: "함께할수록 마음이 편안해지고, 어떤 순간에도\n나의 든든한 편이 되어줄 수 있겠다는 확신이 들었습니다." },
          { text: "앞으로의 날들도 안정감을 주는 든든한 울타리같은 느낌이었달까요!" },
        ],
      },
    ],
  },
  {
    question: "서로에게 가장 고마운 점은?",
    answers: [
      {
        speaker: "groom",
        lines: [
          { text: "평범한 하루를 행복으로 채워주고, 힘들고 지치는 순간에도 언제나 든든한 내 편이 되어주는 것." },
          { text: "언제나 함께 웃고 서로에게 힘이 되어주는 것이 가장 고맙습니다." },
        ],
      },
      {
        speaker: "bride",
        lines: [
          { text: "우리의 일은 물론, 제 개인적인 일에도 늘 자기 일처럼\n발 벗고 나서서 함께해 주는 점이 가장 고마워요." },
          { text: "언제나 든든하게 제 곁을 지켜주고,\n무슨 일이든 함께 고민하고 해결해 주려는 모습에\n큰 의지가 됩니다." },
        ],
      },
    ],
  },
  {
    question: "신혼여행은 어디로 가나요?",
    answers: [
      {
        speaker: "both",
        lines: [
          { text: "물을 좋아하는 저희는 아름다운 바다가 있는\n칸쿤에서 여유로운 시간을 보내고," },
          { text: "신랑이 가장 좋아하는 농구팀이 있는\nLA에서도 즐거운 여행을 할 예정입니다!" },
        ],
      },
    ],
  },
  {
    question: "오시는 분들께 전하고 싶은 말",
    answers: [
      {
        speaker: "both",
        lines: [
          { text: "먼 걸음으로 축복해 주시는 마음을 오래 기억하겠습니다." },
          { text: "저희의 시작을 함께 바라봐 주세요.", highlight: true },
        ],
      },
    ],
  },
];

function SpeakerName({ speaker }: { speaker: Answer["speaker"] }) {
  const emoji = speaker === "groom" ? "🤵🏻" : speaker === "bride" ? "👰🏻‍♀️" : "🤵🏻👰🏻‍♀️";
  const label =
    speaker === "groom"
      ? "신랑 세인"
      : speaker === "bride"
        ? "신부 화진"
        : "세인과 화진";
  return (
    <div className="mb-3 flex items-center gap-2 text-[14px] text-[#333]">
      <span aria-hidden="true" className="shrink-0">{emoji}</span>
      <strong className="font-bold">{label}</strong>
    </div>
  );
}

function InterviewCard({
  item,
  index,
}: {
  item: InterviewItem;
  index: number;
}) {
  return (
    <article className="py-8 first:pt-2">
      <h3 className="text-[15px] font-semibold leading-7 text-[#333]" style={{ textWrap: "pretty" }}>
        <span className="mr-1">
          Q{index + 1}.
        </span>
        {item.question}
      </h3>

      <div className="mt-5">
        {item.answers.map((answer, answerIndex) => (
          <div
            key={`${answer.speaker}-${answerIndex}`}
            className={answerIndex > 0 ? "mt-8" : ""}
          >
            <SpeakerName speaker={answer.speaker} />
            <div className="space-y-3 text-[15px] leading-7 text-[#444]" style={{ textWrap: "pretty" }}>
              {answer.lines.map((line) => (
                <p key={line.text} className="whitespace-pre-line">
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function InterviewSection({
  debugClass = "",
}: InterviewSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className={`bg-[#fafafa] px-6 py-14 ${debugClass}`}
      style={{ fontFamily: "'Gowun Dodum', system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-[390px]">
        <div className="text-center">
          <p className="text-[13px] text-[#9b948b]" style={{ fontFamily: "'Elsie', serif" }}>
            INTERVIEW
          </p>
          <h2 className="mt-3 text-[20px] font-normal text-[#333]">
            우리 두 사람의 이야기
          </h2>
        </div>

        <p className="mt-8 text-center text-[15px] leading-7 text-[#777]">
          결혼을 앞두고 저희 두 사람의
          <br />
          인터뷰를 준비했습니다.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <img
            src={groomPhoto}
            alt="신랑 이세인의 어린 시절"
            loading="lazy"
            className="aspect-square w-full rounded-[6px] object-cover"
          />
          <img
            src={bridePhoto}
            alt="신부 유화진의 어린 시절"
            loading="lazy"
            className="aspect-square w-full rounded-[6px] object-cover"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            id="wedding-interview-toggle"
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#e8e8e8] bg-white px-5 py-3 text-[14px] text-[#555] transition-colors hover:bg-[#f2f2f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b948b]"
            aria-expanded={open}
            aria-controls="wedding-interview"
          >
            <Mail size={16} className="shrink-0 text-[#999]" aria-hidden="true" />
            <span>신랑 &amp; 신부의 인터뷰 읽어보기</span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-[#999] transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
        <div
          id="wedding-interview"
          role="region"
          aria-labelledby="wedding-interview-toggle"
          aria-hidden={!open}
          inert={!open}
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mt-8 divide-y divide-[#dedede] border-t border-[#dedede] pt-6 break-keep">
              {items.map((item, index) => (
                <InterviewCard key={item.question} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
