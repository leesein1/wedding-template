import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Mail, X } from "lucide-react";
import groomPhoto from "@/assets/img/어린_이세인.png";
import bridePhoto from "@/assets/img/어린_유화진.png";

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
  return (
    <div className="mb-2 text-[14px] font-medium text-[#555]">{label}</div>
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
      <h3 className="text-[15px] font-semibold leading-7 text-[#333]">
        <span className="mr-1">
          Q{index + 1}.
        </span>
        {item.question}
      </h3>

      <div className="mt-5">
        {item.answers.map((answer, answerIndex) => (
          <div
            key={`${answer.speaker}-${answerIndex}`}
            className={answerIndex > 0 ? "mt-6" : ""}
          >
            <SpeakerName speaker={answer.speaker} />
            <div className="space-y-1.5 text-[15px] leading-7 text-[#444]">
              {answer.lines.map((line) => (
                <p key={line.text}>
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
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = openerRef.current;

    const htmlOverflow = document.documentElement.style.overflow;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const bodyScrollTop = document.body.scrollTop;
    const bodyStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      width: document.body.style.width,
      height: document.body.style.height,
      overflow: document.body.style.overflow,
    };

    // Keep the page visually at its original position while the dialog owns scrolling.
    Object.assign(document.body.style, {
      position: "fixed",
      top: `${-scrollY}px`,
      left: `${-scrollX}px`,
      width: "100%",
      height: "auto",
      overflow: "hidden",
    });
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    contentRef.current?.scrollTo(0, 0);

    return () => {
      dialog.close();
      document.documentElement.style.overflow = htmlOverflow;
      Object.assign(document.body.style, bodyStyle);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
      document.body.scrollTop = bodyScrollTop;
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closing) return;
    const timer = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 240);
    return () => window.clearTimeout(timer);
  }, [open, closing]);

  const closeInterview = () => setClosing(true);

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
            ref={openerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-[#e8e8e8] bg-white px-5 py-3 text-[14px] text-[#555] transition-colors hover:bg-[#f2f2f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b948b]"
            aria-haspopup="dialog"
            aria-controls="wedding-interview"
          >
            <Mail size={16} className="shrink-0 text-[#999]" aria-hidden="true" />
            <span>신랑 &amp; 신부의 인터뷰 읽어보기</span>
          </button>
        </div>
      </div>

      {createPortal(
        <dialog
          ref={dialogRef}
          id="wedding-interview"
          aria-labelledby="wedding-interview-title"
          data-closing={closing}
          className="wedding-interview-dialog fixed inset-0 m-auto h-[100dvh] max-h-[100dvh] w-full max-w-[430px] overflow-hidden border-0 bg-[#fafafa] p-0 text-[#333] backdrop:bg-black/40"
          style={{ fontFamily: "'Gowun Dodum', system-ui, sans-serif" }}
          onCancel={(event) => {
            event.preventDefault();
            closeInterview();
          }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
              closeInterview();
            }
          }}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && closing) {
              setOpen(false);
              setClosing(false);
            }
          }}
        >
          <div className="flex h-full flex-col">
            <header className="relative flex min-h-16 shrink-0 items-center justify-center border-b border-[#ededed] px-14">
              <h2 id="wedding-interview-title" className="text-center text-[18px] font-normal">
                우리 두 사람의 이야기
              </h2>
              <button
                type="button"
                onClick={closeInterview}
                aria-label="인터뷰 닫기"
                title="닫기"
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9b948b]"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>
            <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain break-keep px-7 pb-8 pt-5">
              <div className="divide-y divide-[#dedede]">
                {items.map((item, index) => (
                  <InterviewCard key={item.question} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </dialog>,
        document.body,
      )}
    </section>
  );
}
