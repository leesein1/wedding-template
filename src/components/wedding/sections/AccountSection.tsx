import { useMemo, useState } from "react";

type AccountSectionProps = {
  debugClass?: string;
};

type AccountItem = {
  side: "groom" | "bride";
  roleLabel: string;
  ownerName: string;
  bankName: string;
  accountNo: string;
  pay?: "kakaopay" | "none";
};

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 9h10v12H9V9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path
        d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cx("transition-transform duration-200", open && "rotate-180")}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PayBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[#2a2a2a]">
      <span className="inline-block h-[14px] w-[14px] rounded-[4px] bg-[#2a2a2a] opacity-15" />
      <span className="text-[13px] font-semibold">pay</span>
    </span>
  );
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function AccountCard({ item }: { item: AccountItem }) {
  const onCopy = async () => {
    const ok = await copyToClipboard(item.accountNo);
    // 청첩장에서는 alert 너무 튀면 싫어서, 실패시에만 알림
    if (!ok) alert("복사에 실패했어요. 길게 눌러 복사해주세요.");
  };

  return (
    <div className="rounded-2xl bg-white shadow-[0_14px_26px_rgba(0,0,0,0.07)] border border-[#eeeeee]">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="text-[13px] text-[#2a2a2a]">{item.roleLabel}</div>
        <div className="text-[13px] font-semibold text-[#2a2a2a]">{item.ownerName}</div>
      </div>

      <div className="px-5 pb-4 pt-3">
        <div className="flex items-center justify-between rounded-2xl bg-[#f3f3f3] px-4 py-3">
          <div className="min-w-0">
            <div className="text-[12px] text-[#8a8a8a]">{item.bankName}</div>
            <div className="mt-[2px] text-[13px] tracking-[0.02em] text-[#2a2a2a]">
              {item.accountNo}
            </div>
          </div>

          <div className="ml-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10"
              aria-label="계좌번호 복사"
              title="복사"
            >
              <span className="text-[#555]">
                <CopyIcon />
              </span>
            </button>

            {item.pay === "kakaopay" ? <PayBadge /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#ededed] bg-white shadow-[0_18px_35px_rgba(0,0,0,0.06)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="text-[14px] font-semibold text-[#1a1a1a]">{title}</div>
        <div className="text-[#777]">
          <ChevronIcon open={open} />
        </div>
      </button>

      {/* ✅ open이면 펼치고, 아니면 닫힘 / 서로 독립 */}
      <div className={cx("grid transition-[grid-template-rows] duration-250 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="min-h-0 overflow-hidden">
          {/* ✅ 펼쳐졌을 때 내부 배경: 그레이 톤 */}
          <div className="bg-[#e3e3e3] px-4 pb-5 pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function AccountSection({ debugClass = "" }: AccountSectionProps) {
  // ✅ 여기 데이터만 너 실제 값으로 교체
  const data: AccountItem[] = useMemo(
    () => [
      { side: "groom", roleLabel: "신랑", ownerName: "이민호", bankName: "토그은행", accountNo: "123-456-789012", pay: "kakaopay" },
      { side: "groom", roleLabel: "신랑 아버지", ownerName: "이정빈", bankName: "토그은행", accountNo: "123-456-789012", pay: "kakaopay" },
      { side: "groom", roleLabel: "신랑 어머니", ownerName: "홍지은", bankName: "토그은행", accountNo: "123-456-789012", pay: "kakaopay" },

      { side: "bride", roleLabel: "신부", ownerName: "김화진", bankName: "토그은행", accountNo: "987-654-321000", pay: "kakaopay" },
      { side: "bride", roleLabel: "신부 아버지", ownerName: "김OO", bankName: "토그은행", accountNo: "987-654-321000", pay: "kakaopay" },
      { side: "bride", roleLabel: "신부 어머니", ownerName: "박OO", bankName: "토그은행", accountNo: "987-654-321000", pay: "kakaopay" },
    ],
    []
  );

  const groomList = data.filter((d) => d.side === "groom");
  const brideList = data.filter((d) => d.side === "bride");

  // ✅ 디폴트: 둘 다 닫힘
  const [groomOpen, setGroomOpen] = useState(false);
  const [brideOpen, setBrideOpen] = useState(false);

  return (
    <section className={cx("px-6 py-10 bg-[#ffffff]", debugClass)}>
      <div className="max-w-[420px] mx-auto">
        <div className="text-center">
          <div style={{ fontFamily: "'Elsie', serif" }} className="text-[26px] tracking-[0em] text-[#1a1a1a]">
            마음 전하실 곳
          </div>
          <p className="mt-4 text-[13px] text-[#8b8b8b]">
            축하의 마음을 전하실 분들을 위해 계좌번호를 안내드립니다.
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <Accordion title="신랑측에게" open={groomOpen} onToggle={() => setGroomOpen((v) => !v)}>
            <div className="space-y-3">
              {groomList.map((item, idx) => (
                <AccountCard key={`g-${idx}-${item.roleLabel}`} item={item} />
              ))}
            </div>
          </Accordion>

          <Accordion title="신부측에게" open={brideOpen} onToggle={() => setBrideOpen((v) => !v)}>
            <div className="space-y-3">
              {brideList.map((item, idx) => (
                <AccountCard key={`b-${idx}-${item.roleLabel}`} item={item} />
              ))}
            </div>
          </Accordion>
        </div>

        <div className="h-2" />
      </div>
    </section>
  );
}