import React from "react";

interface WeddingCardProps {
  children: React.ReactNode;
}

/**
 * 메인 웨딩 페이지에서 사용하는 공통 카드 래퍼입니다.
 *
 * 이 컴포넌트는 바깥 배경, 좌우의 빛나는 인셋 그림자, 그리고
 * 박스 그림자/하이라이트가 있는 종이 같은 카드 컨테이너를 담당합니다.
 *
 * 여기에 있는 클래스 이름이나 인라인 스타일을 수정하면
 * 해당 래퍼를 사용하는 모든 페이지의 전체적인 모양이 바뀝니다.
 * 예를 들면:
 *  - `bg-[#ecebe8]`를 다른 헥스값으로 바꾸면 페이지 배경색이 바뀝니다
 *  - 두 개의 `bg-gradient-to-*` div를 조정하여 측면 가장자리의
 *    어둡기/밝기를 조절하거나, `blur`를 제거해 선명하게 만들 수 있습니다
 *  - `boxShadow` 문자열을 수정하면 카드가 더 떠 보이거나 덜 떠 보이게 할 수 있습니다
 */
const WeddingCard: React.FC<WeddingCardProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#ecebe8] flex justify-center">
      {/* left edge shadow; adjust width/opacity/blur to control intensity */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black/18 to-transparent blur-[0.5px]" />
      {/* right edge shadow */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black/18 to-transparent blur-[0.5px]" />

      <div
        className="relative w-full max-w-[430px] bg-[#fbfbfb] text-black flex flex-col"
        style={{
          boxShadow:
            "0 28px 70px rgba(0,0,0,0.14), 0 10px 22px rgba(0,0,0,0.07)",
        }}
      >
        {/* subtle top highlight mimicking paper gloss */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/70 to-transparent" />
        {children}
      </div>
    </div>
  );
};

export default WeddingCard;
