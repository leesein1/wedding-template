type ShareSectionProps = {
  debugClass?: string;
};

export default function ShareSection({ debugClass = "" }: ShareSectionProps) {
  return (
    <section className={`px-6 py-10 ${debugClass}`}>
      KakaoTalk Share / Copy Link
    </section>
  );
}
