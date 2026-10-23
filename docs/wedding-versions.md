# 주소별 청첩장

- 기존: `https://hwajinyu.silee.net/`
- 두 번째: `https://hwajinyu2.silee.net/`
- 버전별 설정: `src/config/wedding-versions.json`
- 화면 버전 선택: `src/config/wedding.ts`

`index.html`의 첫 스크립트가 도메인으로 `data-wedding-version` 플래그를
확정합니다. 로딩 커버의 CSS와 React 설정이 같은 플래그를 읽으므로
React 로딩 전후에 메인 사진이 다른 버전으로 바뀌지 않습니다.

기존 디자인, 날짜, 신랑/신부 정보, 갤러리와 기능은 공통으로 사용합니다.
두 번째 버전은 메인 사진 7번, 신부 아버지 박주호(계좌 없음),
신부 어머니 박선자(농협 173089-56-052987)를 표시합니다.
계좌가 없는 카드는 이름만 표시하고 복사 버튼을 만들지 않습니다.

## 빌드와 미리보기

`npm run build`는 기존 `dist/index.html`과 두 번째 `dist/index-v2.html`을
생성합니다. 두 번째 HTML은 자체 OG 정보와 버전 표시를 포함하므로
카카오 크롤러가 JavaScript를 실행하지 않아도 올바른 미리보기를 읽습니다.
카카오 공유 버튼과 링크 복사는 선택된 버전의 정식 도메인을 사용합니다.

`npm run preview` 실행 후 `/index-v2.html`에서 두 번째 화면을 볼 수 있습니다.
이 경로는 정식 도메인 연결 전에도 검토할 수 있지만, 공유 링크는 항상
`https://hwajinyu2.silee.net/`으로 연결됩니다.

## 새 도메인 연결

1. 기존 Vercel `wedding-template` 프로젝트의 Domains에
   `hwajinyu2.silee.net`을 추가합니다. 기존 주소로 리다이렉트하지 않고
   같은 Production 배포에 직접 연결합니다.
2. DNS 관리에서 Vercel이 안내하는 CNAME 레코드를 추가합니다.
3. `vercel.json`의 호스트 조건 route가 정적 파일 처리보다 먼저 새 주소의 `/`를
   `/index-v2.html`로 내부 연결합니다. 브라우저 주소는 그대로 유지됩니다.
4. 카카오 앱의 JavaScript SDK 도메인과 웹 도메인에 새 주소를 추가합니다.
   `docs/kakao-share.md`를 참고합니다.
5. 두 정식 주소에서 사진, 신부측 계좌, 링크 복사, 지도, 카카오톡 공유와
   URL 붙여넣기 미리보기를 확인합니다.

Vercel/DNS/카카오의 계정 설정은 Git push만으로 자동 등록되지 않습니다.
