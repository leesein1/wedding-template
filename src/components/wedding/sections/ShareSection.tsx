/*
  ShareSection: SNS 공유 버튼 또는 링크 복사
*/
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
