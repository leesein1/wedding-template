# 💍 웨딩 모바일 청접장 템플릿 | Wedding-Template

> React + TypeScript + Vite로 제작된 모바일 청첩장 웹 템플릿

---

## 🎉 실제 프로젝트 기반

이 템플릿은 실제 결혼식을 위해 여러 모바일 청첩장 페이지를 참고하고, 디자인하여 제작되었습니다.
27년 1월 16일 실제 결혼식을 위해 제작되었으며, 템플릿으로 공개하는 과정에서 개인정보(전화번호, 계좌정보)는 제거되었으며,
현재 실제 웨딩 사진 대신 AI를 활용한 예제 이미지를 사용하고 있습니다.

---

## 📖 이 프로젝트를 만든 이유

모바일 청첩장 하나에 1~2만원을 쓰고, 결혼식 이후로는 유지되지 않은 채 사라지는 게 아까웠어요.
그래서 **"내가 직접 만들면 어떨까?"** 라는 생각이 들었습니다.

처음엔 HTML/CSS/JS로 간단하게 시작하려 했지만, 마침 React와 TypeScript를 공부하던 중이라
학습과 실전 프로젝트를 함께 해보자고 방향을 전환했습니다.
복잡한 기능들은 AI 도움을 받으며 빠르게 구현하고 공부했으며,
**"명색이 개발자인데~"** 모바일 청첩장 정도는 직접 만들어보는게 어떨까 해서 시작했습니다!

---

## 개요

React로 제작된 모던한 모바일 청첩장 웹사이트 템플릿입니다.
깔끔하고 여자친구의 취향이 듬뿍 담긴(?) 템플릿 입니다!

---

## 주요 기능

### 🎨 디자인

- 💌 카드형 레이아웃 (초대장 느낌)
- 🌫️ 스크롤 감지 Reveal 애니메이션
- ❤️ SVG 하트 드로잉 인트로
- 📱 모바일 퍼스트 반응형 설계

### ⚡ 현재 구현된 기능

- 🎞️ **이미지 갤러리** - 터치/드래그 제스처 지원, Zoom Modal
- 🗺️ **카카오 지도** - 웨딩홀 위치 표시 (API 키 필요)
- 📅 **카운트다운** - 결혼식 날짜까지 실시간 카운트다운
- 💰 **축의금 계좌** - 복사 버튼으로 쉬운 계좌 전달
- 📜 **식순 타임라인** - 예식 일정을 시각적으로 표현
- 🎵 **배경 음악** - 헤더 토글 버튼으로 제어
- 🔒 **인트로 스크롤 처리** - 첫 화면 로드 시 스크롤 잠금, 새로고침 후 자동 초기화

---

## 사전 요구사항

- **Node.js**: v18 이상 (`.nvmrc` 확인)
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

### 3️⃣ 환경변수 설정

`.env.local` 파일을 생성하고 다음을 추가합니다:

```env
# 카카오 지도 API (선택사항)
VITE_KAKAO_MAP_API_KEY=your_kakao_api_key
```

**주의**: 이 템플릿은 백엔드가 없는 정적 사이트입니다.
카카오 지도 기능만 환경변수가 필요하며, 나머지는 소스코드에서 직접 수정하면 됩니다.

### 4️⃣ 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 열기

### 5️⃣ 프로덕션 빌드

```bash
npm run build
npm run preview
```

---

## 🎨 커스터마이징

### 반드시 수정해야 할 부분

#### 1. 기본 정보 수정

각 섹션 파일을 수정합니다 (`src/components/wedding/sections/`):

**AboutUsSection.tsx** - 신랑/신부 정보

```tsx
const groom: PersonCard = {
  name: "신랑이름",
  tel: "010-xxxx-xxxx",
  birth: "xx년 xx월 xx일",
  job: "직업",
  // ... 나머지 수정
};
```

**CalendarSection.tsx** - 결혼식 날짜

```tsx
const target = useMemo(() => new Date("YYYY-MM-DDTHH:MM:00+09:00"), []);
```

**LocationSection.tsx** - 예식장 정보

```tsx
const VENUE = {
  name: "예식장 이름",
  address: "주소",
  lat: 37.xxxx,  // 위도
  lng: 126.xxxx, // 경도
};
```

**AccountSection.tsx** - 축의금 계좌

```tsx
const defaultAccounts: AccountItem[] = [
  {
    side: "groom",
    ownerName: "신랑이름",
    bankName: "은행명",
    accountNo: "계좌번호", // 실제 계좌로 수정
    pay: "kakaopay", // 선택사항
  },
  // ... 신부 계좌도 추가
];
```

#### 2. 이미지 교체

경로: `src/assets/img/`

주요 이미지:

- `흑백1.png` - 메인 히어로 사진
- `컬러1.png`, `컬러2.png` - 갤러리 이미지
- `야외컬러1.png` - 신랑 프로필
- `야외컬러2.png` - 신부 프로필

**팁**: 이미지는 가로 1000px 이하로 리사이징하면 로딩 속도가 빨라집니다.
웨딩 스튜디오의 원본 고해상도 사진은 약 1000x1500 정도로 조정하면 좋습니다.

#### 3. 배경 음악 설정

`public/music/` 폴더에 음악 파일 추가:

```
public/music/wedding.mp3
```

#### 4. 스타일 변경

**WeddingCard.tsx** - 카드 레이아웃 커스터마이징

```tsx
// 배경색 변경
bg-[#ecebe8] → bg-[#your-color]

// 그림자 조정
boxShadow: "0 28px 70px rgba(0,0,0,0.14), ..."
```

모든 섹션은 Tailwind CSS를 사용하므로 클래스명으로 스타일을 쉽게 수정할 수 있습니다.

---

## 📁 프로젝트 구조

```
src/components/wedding/sections/
    ├── HeaderSection.tsx        # 음악 토글 버튼
    ├── HeroPhotoSection.tsx      # 메인 사진 + 하트 드로잉
    ├── CoupleInfoSection.tsx     # 신랑/신부 소개
    ├── DateTitleSection.tsx      # 결혼 날짜 & 제목
    ├── CalendarSection.tsx       # 달력 & 카운트다운
    ├── AboutUsSection.tsx        # 신랑/신부 상세 프로필
    ├── TimelineSection.tsx       # 식순 타임라인
    ├── GallerySection.tsx        # 사진 슬라이더
    ├── LocationSection.tsx       # 예식장 위치 & 교통
    ├── AccountSection.tsx        # 축의금 계좌
    └── FooterSection.tsx         # 페이지 하단
```

---

## 🚢 배포하기

### GitHub Pages 배포

#### 1️⃣ Fork 또는 저장소 생성

저장소를 본인 GitHub 계정으로 Fork합니다.

#### 2️⃣ package.json 수정

```json
{
  "homepage": "https://yourusername.github.io/wedding-template"
}
```

#### 3️⃣ GitHub 설정

- **Settings > Pages**
  - Source: "GitHub Actions" 선택

- **Settings > Actions > General**
  - "Workflow permissions": "Read and write permissions" 선택

#### 4️⃣ 깃허브 시크릿 추가 (카카오 MAP 사용 시)

- **Settings > Secrets and variables > Actions**
- `VITE_KAKAO_MAP_API_KEY` 추가

#### 5️⃣ 배포

```bash
git push origin main
# GitHub Actions가 자동으로 빌드 및 배포합니다
```

### 다른 호스팅 서비스

이 프로젝트는 정적 웹사이트이므로 여러 플랫폼에서 배포 가능합니다.

#### Vercel / Netlify 배포

```bash
npm run build
# dist/ 폴더가 생성되고, 호스팅 플랫폼에 업로드하면 됩니다
```

#### Firebase 배포 (향후 방명록 등 기능 추가 시)

```bash
# Firebase CLI 설치
npm install -g firebase-tools
firebase login
firebase init hosting

# 배포
npm run build
firebase deploy
```

**Firebase 선택 이유:**

- 방명록, 메시지 저장 등 백엔드 기능 필요 시 **Realtime Database** 연동 가능
- 무료 플랜으로 충분한 용량 제공
- 추가 기능 확장이 자유로움

---

## 🛠 사용 가능한 명령어

```bash
npm run dev       # 개발 서버 실행
npm run build     # 프로덕션 빌드
npm run preview   # 빌드된 버전 미리보기
npm run lint      # ESLint 체크
```

---

## 📋 기술 스택

- **React 19** - UI 프레임워크
- **TypeScript** - 타입 안정성
- **Vite** - 초고속 빌드 도구
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **카카오 지도 API** - 위치 표시
- **React Hooks** - 상태 관리

---

## 💡 팁

### 결혼식 후 아카이브하기

1. 모든 개인정보(계좌, 연락처) 제거
2. 사진은 유지
3. 정적 페이지로 영구 보관

### 로딩 속도 최적화

1. 이미지 압축 (1000px 이하)
2. WebP 포맷 사용 권장
3. CDN을 통한 배포 권장

---

## 🚧 진행 중인 작업

결혼식 전이라 아직 시간이 남아있는 만큼 계속 추가 기능을 개발 중입니다:

- 📷 **웨딩 사진 갤러리 추가** - 결혼식 이후 새로운 사진들을 동적으로 추가
- 💬 **방명록 기능** - 하객들이 축하 메시지를 남길 수 있도록 Firebase와 연동
- ⚡ **성능 최적화** - 이미지 최적화, 번들 크기 감소
- 📱 **모바일 앱 버전** - React Native로 앱 배포 고려

---

## � 개발 과정 노트

### 🤖 AI 활용

이 프로젝트는 학습과 실전을 함께 하기 위해 제작되었으며, 일부 복잡한 기능 구현에는 AI의 도움을 받았습니다:

- 🎨 **스크롤 Reveal 애니메이션** 로직
- 🖼️ **이미지 갤러리 드래그 제스처** 구현
- 🗺️ **카카오 지도 API** 통합
- ⏰ **카운트다운 타이머** 정확한 계산
- 🔒 **스크롤 잠금 처리** (새로고침 후 스크롤 위치 복구)

**배운 점:**

1. AI는 **빠른 프로토타이핑**에 최고의 파트너
2. 코드를 꼼꼼히 검토하고 이해하는 게 중요
3. 직접 만든 것이 더 **소중하고 오래도록 유지**됨

### 📝 후기

청첩장 1개에 1~2만원 쓰고 사라진다는 게 아까워서 시작한 프로젝트였는데,
직접 만들면서 정말 많은 걸 배웠습니다.

**하나의 서비스를 완성하려면:**

- 단순한 기능 구현을 넘어 **UX/UI 디자인** 고민이 필요
- 모바일 환경에서 **성능과 접근성**을 동시에 고려
- **에러 처리와 엣지 케이스** 생각하기
- 결과물을 **지속해서 유지보수**하기

이 템플릿이 다른 예비부부들에게도 도움이 되어
**자신만의 청첩장을 만드는 즐거움**을 나눌 수 있으면 좋겠습니다. 🎉

---

## 📝 라이선스

MIT License - 자유롭게 수정, 배포, 사용 가능합니다

---

**🎉 행복한 결혼식 되세요!**

Made with ❤️ using React, TypeScript, Vite, and a little help from AI 🤖
