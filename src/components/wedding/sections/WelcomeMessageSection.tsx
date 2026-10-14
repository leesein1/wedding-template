/*
  WelcomeMessageSection: 환영 메시지 이미지
*/
import welcomeImage from "@/assets/img/last/preview/img_22.webp";

type WelcomeMessageSectionProps = {
  debugClass?: string;
};

export default function WelcomeMessageSection({
  debugClass = "",
}: WelcomeMessageSectionProps) {
  return (
    /// 여백 주고싶으면 px-6 py-10을 클래스에 추가하면 됨
    <section className={`text-center ${debugClass}`}>
      <img
        src={welcomeImage}
        alt="Welcome"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="mx-auto w-full max-w-[430px] object-contain"
      />
    </section>
  );
}
