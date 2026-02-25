# 💍 웨딩 모바일 청첩장 | Wedding-Template

> React + TypeScript + Vite로 제작된\
> 📱 모바일 최적화 웨딩 초대장 웹 템플릿

---

## 📖 Why This Project?

모바일 청첩장 하나에 1\~2만원.\
잠깐 쓰고 사라지는 페이지인데, 조금 아깝게 느껴졌습니다.

그래서 시작했습니다.

> "내가 직접 만들면 어떨까?"

처음엔 HTML/CSS/JS로 만들 생각이었지만,\
마침 React + TypeScript를 공부하던 중이라\
학습과 실전 프로젝트를 함께 해보자는 마음으로 방향을 전환했습니다.

일부 복잡한 인터랙션은 AI의 도움을 받아 빠르게 구현했고,\
그 과정을 통해 **"직접 만들어도 충분히 쓸 수 있다"**는 걸 보여주고
싶었습니다.

---

## ✨ Features

### 🎨 Design & UI

- 💌 카드형 레이아웃
- 🌫️ 스크롤 Reveal 애니메이션
- ❤️ SVG 하트 드로잉 인트로
- 📱 모바일 퍼스트 반응형 설계
- 🎵 배경 음악 토글

### ⚡ Implemented Features

- 🎞️ 이미지 갤러리 (터치/드래그, 자동재생, Zoom Modal)
- 🗺️ 카카오 지도 API 연동
- 📅 결혼식 카운트다운
- 💰 축의금 계좌 복사 기능
- 📜 식순 타임라인
- 🔒 인트로 스크롤 잠금 처리

---

## 🛠 Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Hooks

---

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/wedding-template.git
cd wedding-template
npm install
npm run dev
```

---

## 🎨 Customization

- 날짜 수정: `CalendarSection.tsx`
- 이미지 교체: `src/assets/img/`
- 음악 추가: `public/music/wedding.mp3`
- 지도 키 설정: `.env.local` → `VITE_KAKAO_MAP_KEY=your_key_here`

---

## 🚢 Deployment

```bash
npm run build
```

`dist/` 폴더를 정적 호스팅에 업로드하세요.

---

## 📝 License

MIT License

---

Made with ❤️ using React, TypeScript and Vite
