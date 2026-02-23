import welcomeImage from "../../../assets/img/메인사진1.jpg";

type WelcomeMessageSectionProps = {
  debugClass?: string;
};

export default function WelcomeMessageSection({ debugClass = "" }: WelcomeMessageSectionProps) {
  return (
    /// 여백 주고싶으면 px-6 py-10을 클래스에 추가하면 됨
    <section className={`text-center ${debugClass}`}>
      <img
        src={welcomeImage}
        alt="Welcome"
        className="mx-auto w-full max-w-[430px] object-contain"
      />
    </section>
  );
}