# 웨딩 초대장 템플릿 | Modern Wedding Invitation Template

> React + TypeScript + Vite로 제작된 스타일리시한 모바일 웨딩 초대장 웹 템플릿
> 사실 이걸 만든 계기는 꽤나 현실적이에요. 모바일 청첩장 하나에
> 1~2만원씩 주고 잠깐 쓰고 마는 게 은근히 아깝더라고요. 그래서
> "내가 만들면 어떨까?" 싶은 생각이 들었고, 그냥 HTML/CSS/JS로
> 뚝딱하려다가 마침 React, TypeScript 공부 중이던 터라
> 겸사겸사 이쪽으로 만들어보자고 방향을 바꿨습니다. 복잡한
> 기능들은 AI 도움도 조금 받고(?) 빠르게 구현했죠. 이런 식으로
> 내 손으로 만들어도 충분히 쓸만하다는 걸 보여주고 싶었습니다.
> [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
> ![React](https://img.shields.io/badge/React-19-blue)
> ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
> ![Vite](https://img.shields.io/badge/Vite-6.0-blueviolet)
> ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-0ea5e9)

---

## 📸 데모

로컬 개발 서버(`npm run dev`)에서 확인할 수 있으며, 공개 배포가 완료되면
여기에 라이브 데모 링크를 추가할 예정입니다.

---

## ✨ 주요 특징

### 🎨 디자인 & UI

- **모던한 카드 디자인**: 물리적 초대장을 연상시키는 우아한 컨테이너
- **부드러운 애니메이션**: 스크롤 감지 시 자동으로 섹션이 나타나는 효과 (Reveal)
- **하트 드로잉 애니메이션**: 첫 화면에서 SVG 하트가 그려지는 시각적 임팩트
- **반응형 디자인**: 모든 모바일 기기에 최적화

### ⚡ 기능 (현재 구현된 것)

- 🎞️ **이미지 갤러리**: 드래그/터치 제스처 지원 슬라이더
- 🗺️ **웨딩홀 위치**: 카카오 지도 API 통합 (환경변수 설정 필요)
- 📅 **카운트다운**: 지정한 결혼식 날짜까지의 타이머
- 💰 **축의금 계좌**: 복사 버튼으로 계좌번호 복사
- 🎬 **타임라인**: 식순을 시각적으로 표현하는 섹션
- 🎵 **백그라운드 음악**: 헤더에서 재생/일시정지 제어
- 📱 **스크롤 잠금/초기화**: 첫 화면 로드 시 스크롤 방지 및 위치 고정

### 🛠️ 기술

- **TypeScript**: 전체 타입 안정성
- **Vite**: 초고속 빌드 및 개발 서버
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **React Hooks**: 함수형 컴포넌트 및 상태 관리
- **클린 아키텍처**: 재사용 가능한 섹션 컴포넌트 분리

---

## 📋 사전 요구사항

- **Node.js**: v18 이상
- **npm**: v9 이상

```bash
node --version
npm --version
```

---

## 🚀 시작하기

### 1️⃣ 저장소 복제

```bash
git clone https://github.com/yourusername/wedding-template.git
cd wedding-template
```

### 2️⃣ 의존성 설치

```bash
npm install
```

### 3️⃣ 개발 서버 실행

```bash
npm run dev
```

### 4️⃣ 프로덕션 빌드

```bash
npm run build
npm run preview
```

---

## 🎨 커스터마이징

### 1. 기본 정보 수정

**`src/components/wedding/sections/` 내 각 섹션 파일 수정:**

- **AboutUsSection**: 신랑/신부 이름, 연락처, 직업 정보
- **CalendarSection**: 결혼식 날짜 (`new Date("2027-01-16T11:00:00+09:00")`)
- **AccountSection**: 축의금 계좌 정보
- **LocationSection**: 예식장 이름, 주소, 좌표 (위도/경도)

### 2. 이미지 교체

경로: `src/assets/img/`

권장사항:

- 가로 1000px 이하로 리사이징
- 총 파일 크기 최소화 (로딩 속도)

### 3. 배경 음악 설정

`public/music/wedding.mp3` 파일 추가

### 4. 색상 & 스타일 변경

`src/components/wedding/WeddingCard.tsx`:

- 배경색: `bg-[#ecebe8]`
- 그림자: `boxShadow` 값

---

## 📁 프로젝트 구조

```
src/components/wedding/sections/
├── HeaderSection.tsx        # 음악 토글 버튼
├── HeroPhotoSection.tsx      # 메인 사진 + 하트 드로잉
├── CoupleInfoSection.tsx     # 신랑/신부 소개
├── DateTitleSection.tsx      # 결혼 날짜
├── CalendarSection.tsx       # 달력 + 카운트다운
├── AboutUsSection.tsx        # 상세 프로필
├── TimelineSection.tsx       # 식순 타임라인
├── GallerySection.tsx        # 사진 슬라이더
├── LocationSection.tsx       # 예식장 위치
├── AccountSection.tsx        # 축의금 계좌
└── FooterSection.tsx         # 페이지 하단
```

---

## 🚢 배포

### GitHub Pages

```bash
# 1. package.json의 homepage 설정
"homepage": "https://yourusername.github.io/wedding-template"

# 2. 배포
git push origin main
```

### 다른 호스팅

```bash
npm run build
# dist/ 폴더를 호스팅 서비스에 배포
```

---

## 🛠️ 사용 가능한 명령어

```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
npm run lint      # 린트 체크
```

---

## 💡 팁

### 결혼식 후 아카이브

1. 개인정보(계좌, 연락처) 제거
2. 사진은 유지
3. 정적 페이지로 영구 보관

### 로딩 속도 최적화

1. 이미지 압축 (1000px 이하)
2. WebP 포맷 사용
3. CDN 배포 권장

---

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

**🎉 행복한 결혼식 되세요!**

Made with ❤️ using React, TypeScript, and Vite
