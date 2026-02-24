/*
  FooterSection: 저작권 정보 등 페이지 하단 포함
*/
type FooterSectionProps = {
  debugClass?: string;
};

export default function FooterSection({ debugClass = "" }: FooterSectionProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`w-full bg-[#fcfcfc] border-t border-[#eeeeee] ${debugClass}`}
    >
      <div className="max-w-[430px] mx-auto px-6 py-12 text-center">
        {/* 저작권 */}
        <p className="mt-4 text-[11px] tracking-[0.1em] text-[#8a8a8a]">
          © {year} 세인 ♥ 화진. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
