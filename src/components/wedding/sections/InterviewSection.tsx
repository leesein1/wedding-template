import { useState } from "react";

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
    question: "처음 만났을 때 서로의 첫인상은?",
    answers: [
      {
        speaker: "groom",
        lines: [
          { text: "웃는 얼굴이 오래 기억에 남았어요.", highlight: true },
          { text: "조용한 듯 다정하고, 대화할수록 편안한 사람이었습니다." },
        ],
      },
      {
        speaker: "bride",
        lines: [
          { text: "말투가 참 따뜻하다고 느꼈어요.", highlight: true },
          { text: "작은 이야기도 잘 들어주는 모습이 좋았습니다." },
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
          { text: "특별한 하루보다 평범한 날들이 좋았어요." },
          {
            text: "오래 함께하고 싶다는 생각이 자연스럽게 들었습니다.",
            highlight: true,
          },
        ],
      },
      {
        speaker: "bride",
        lines: [
          { text: "힘든 날에도 제 편이 되어주는 마음이 고마웠어요." },
          {
            text: "조용하고 단단한 하루들을 만들 수 있겠다고 확신했습니다.",
            highlight: true,
          },
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
          { text: "제 속도보다 조금 느린 날에도 기다려줘요." },
          {
            text: "그 배려 덕분에 더 좋은 사람이 되고 싶어졌습니다.",
            highlight: true,
          },
        ],
      },
      {
        speaker: "bride",
        lines: [
          { text: "늘 먼저 손 내밀어주는 사람이에요.", highlight: true },
          { text: "작은 일상에 안심을 만들어줘서 고맙습니다." },
        ],
      },
    ],
  },
  {
    question: "우리가 닮아가고 있다고 느끼는 순간은?",
    answers: [
      {
        speaker: "both",
        lines: [
          {
            text: "같은 장면에서 웃고, 같은 메뉴를 떠올릴 때요.",
            highlight: true,
          },
          { text: "서로의 말버릇과 취향이 자연스럽게 스며드는 중입니다." },
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
          { text: "따뜻한 햇살이 있는 곳으로 천천히 다녀오려고 해요." },
          {
            text: "맛있는 것 많이 먹고, 사진도 많이 남기고 오겠습니다.",
            highlight: true,
          },
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
  const label =
    speaker === "groom"
      ? "🤵🏻 신랑 세인"
      : speaker === "bride"
        ? "👰🏻‍♀️ 신부 화진"
        : "🤵🏻👰🏻‍♀️ 세인과 화진";
  const color =
    speaker === "groom"
      ? "text-[#53688d]"
      : speaker === "bride"
        ? "text-[#b06b83]"
        : "text-[#806296]";

  return (
    <div className={`mb-2 text-[14px] ${color}`}>{label}</div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="px-[2px]"
      style={{
        background:
          "linear-gradient(transparent 58%, rgba(218,191,226,0.55) 58%)",
      }}
    >
      {children}
    </span>
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
    <article>
      <h3 className="text-[15px] leading-7 text-[#554f58]">
        <span className="mr-1 text-[#bd8fc7]">
          Q{index + 1}.
        </span>
        {item.question}
      </h3>

      <div className="mt-3 rounded-[4px] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(62,49,68,0.045)]">
        {item.answers.map((answer, answerIndex) => (
          <div
            key={`${answer.speaker}-${answerIndex}`}
            className={answerIndex > 0 ? "mt-6" : ""}
          >
            <SpeakerName speaker={answer.speaker} />
            <div className="space-y-1.5 text-[15px] leading-7 tracking-[0.01em] text-[#4f4b51]">
              {answer.lines.map((line) => (
                <p key={line.text}>
                  {line.highlight ? (
                    <Highlight>{line.text}</Highlight>
                  ) : (
                    line.text
                  )}
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
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 3);

  return (
    <section
      className={`relative overflow-hidden bg-[#fbfaf8] px-5 py-16 ${debugClass}`}
      style={{ fontFamily: "'Gowun Dodum', system-ui, sans-serif" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(188,153,197,0.18) 0 1px, transparent 1px), linear-gradient(45deg, rgba(218,207,191,0.2) 0 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative mx-auto max-w-[390px]">
        <div className="text-center">
          <p
            className="text-[20px] leading-none text-[#b58cc5]"
            style={{ fontFamily: "'WeddingSignature', cursive" }}
          >
            Interview
          </p>
          <h2 className="mt-2 text-[24px] font-medium tracking-normal text-[#bd8fc7]">
            우리에게 물었습니다
          </h2>
        </div>

        <div className="mt-9 space-y-11">
          {visibleItems.map((item, index) => (
            <InterviewCard key={item.question} item={item} index={index} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex h-10 items-center gap-2 px-4 text-[14px] text-[#4b464d] transition-opacity hover:opacity-70"
            aria-expanded={expanded}
          >
            <span>{expanded ? "접기" : "더보기"}</span>
            <span
              aria-hidden
              className="text-[18px] leading-none transition-transform"
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ˅
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
