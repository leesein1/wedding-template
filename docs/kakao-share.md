# 카카오톡 청첩장 공유 설정

주소를 채팅에 붙여넣으면 일반 링크 미리보기가 생성됩니다.
큰 사진과 "청첩장 보기" 버튼이 있는 카드를 보내려면 청첩장 하단의
"카카오톡 공유" 버튼을 사용하세요. 받는 사람은 카카오톡에서 직접 선택합니다.

## 카카오디벨로퍼스

기존 지도 키를 발급한 앱을 사용할 수 있습니다.

1. https://developers.kakao.com/ 에 로그인하고 해당 앱을 선택합니다.
2. **앱 > 플랫폼 키 > JavaScript 키 > JavaScript SDK 도메인**에
   `https://hwajinyu.silee.net`을 등록합니다.
3. **앱 > 제품 링크 관리**에 같은 웹 도메인을 등록합니다.
4. 앱 기본 정보의 이름과 아이콘을 청첩장에 맞게 설정합니다.
   공유 카드 아래의 앱 이름과 아이콘은 이 설정에서 가져옵니다.
5. 로컬 테스트 시 JavaScript SDK 도메인에 `http://localhost:5173`도 등록합니다.

카카오 로그인 활성화, 액세스 토큰, 사용자 정의 템플릿 생성은 필요하지 않습니다.
기본 피드 템플릿을 사용합니다.

## 환경변수

공유 기능은 `VITE_KAKAO_SHARE_JS_KEY`를 먼저 사용하며, 없으면 기존
`VITE_KAKAO_MAP_JS_KEY`를 사용합니다. 같은 앱을 사용한다면 기존 키로 충분합니다.
JavaScript 키를 사용해야 하며 REST API 키나 Admin 키를 넣지 않습니다.

다른 앱을 사용할 경우 `.env.local`과 배포 서비스의 Production 환경변수에
`VITE_KAKAO_SHARE_JS_KEY`를 설정한 다음 다시 빌드하고 배포합니다.
Vite 환경변수는 빌드 시 반영됩니다.

## 확인

배포 후 휴대폰에서 `https://hwajinyu.silee.net/`을 열고 하단 공유 버튼을 누릅니다.
본인 채팅방을 선택해서 사진, 이름, 날짜, "청첩장 보기" 링크를 확인합니다.
버튼을 통한 공유와 URL 붙여넣기의 미리보기는 서로 다른 방식입니다.
이미 보낸 링크 미리보기는 새 공유 카드로 자동 변환되지 않습니다.

이미지는 공개 HTTPS URL인 `/og-image.jpg`를 사용합니다.
사진의 실제 크기는 2160 x 2700이며, 카카오톡의 템플릿 규칙에 따라 표시됩니다.

## 공식 문서

- https://developers.kakao.com/docs/ko/tutorial/js-share
- https://developers.kakao.com/docs/ko/kakaotalk-share/js-link
- https://developers.kakao.com/docs/ko/javascript/getting-started
