# 상다리 (Sangdari) Frontend

행사 조건에 맞는 밥차·푸드트럭을 탐색하고, 견적 요청부터 예약 및 결제까지 진행할 수 있는 **상다리** 서비스의 웹 클라이언트입니다.

백엔드 저장소: [sangdari-backend](https://github.com/1-team-whynot/sangdari-backend)

## 주요 기능

- 회원가입, 로그인·로그아웃, 비밀번호 찾기
- 행사 장소·일정·인원·메뉴 카테고리·전기 사용 여부를 입력하는 체크리스트
- 조건 기반 업체 목록 및 업체·메뉴 상세 조회
- 선택 메뉴를 포함한 견적 요청 생성 및 내 요청 목록 조회·예약 취소
- 계약금/잔금 결제 화면, 토스페이먼츠 결제 결과 처리 및 모의 결제 흐름
- 내 정보 조회·수정, 비밀번호 변경, 회원 탈퇴

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Framework | Vue `3.5.34`, Vue Router `5.1.0` |
| Build | Vite `8.0.12` |
| State | Pinia `3.0.4` |
| HTTP | Axios `1.18.0` |
| Utility | Day.js, jwt-decode |
| Deployment | Docker, Nginx |

## 프로젝트 구조

```text
src/
├── domains/
│   ├── api/             # Axios 인스턴스 및 결제 API
│   ├── auth/            # 인증 화면·입력 검증
│   ├── checklist/       # 행사 조건 입력 및 상태
│   ├── common/          # Header, Footer, Modal 등 공통 컴포넌트
│   ├── home/            # 메인 화면
│   ├── myRequest/       # 내 견적 요청 목록
│   ├── payment/         # 결제 및 결과 화면
│   ├── reservation/     # 견적 요청 생성 및 임시 상태
│   ├── store/           # 업체 목록·상세·메뉴 선택
│   └── user/            # 회원 정보 관리
├── router/              # 라우트 및 인증 가드
├── stores/              # 인증·사용자·오류 전역 상태
└── utils/               # 이미지/파일 URL 처리 유틸리티
```

## 시작하기

### 요구 사항

- Node.js 24 이상 권장
- npm
- 실행 중인 [백엔드 API](https://github.com/1-team-whynot/sangdari-backend)

### 설치 및 실행

```bash
git clone https://github.com/1-team-whynot/sangdari-frontend.git
cd sangdari-frontend
npm install
npm run dev
```

개발 서버 주소는 실행 결과에 표시되는 Vite URL(기본 `http://localhost:5173`)입니다.

### 환경 변수

프로젝트 루트에 `.env`를 만들고 아래 값을 설정합니다. `VITE_` 접두사가 있는 값만 브라우저 코드에서 사용할 수 있으므로, 비밀 키를 넣지 마세요.

```dotenv
VITE_APP_TITLE=상다리
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_VERSION=local
VITE_MODE=development
VITE_APP_URL=http://localhost:5173
VITE_TOSS_CLIENT_KEY=토스페이먼츠_클라이언트_키
```

`VITE_API_BASE_URL`은 백엔드의 `/api`까지 포함합니다. 실제 결제 연동을 사용하지 않는 경우에도 현재 결제 화면이 해당 키를 참조하므로 빈 값 대신 테스트 클라이언트 키를 설정하세요.

### 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 배포용 정적 파일 생성 (`dist/`) |
| `npm run preview` | 빌드 결과 로컬 미리보기 |

## 주요 화면 경로

| 경로 | 설명 |
| --- | --- |
| `/` | 메인 |
| `/checklist` | 행사 조건 체크리스트 |
| `/storelist` | 업체 목록 |
| `/stores/:storeId` | 업체·메뉴 상세 |
| `/reservation/create` | 견적 요청 작성 |
| `/my-requests` | 내 요청 목록 |
| `/payment` | 결제 |
| `/auth/login`, `/users/signup` | 로그인, 회원가입 |
| `/users/info` | 내 정보 |

인증이 필요한 경로는 라우터 가드에서 로그인 페이지로 이동시킵니다.

## 백엔드 연동

Axios 인스턴스는 `src/domains/api/myAxios.js`에 있으며, `VITE_API_BASE_URL`을 기준으로 API를 호출합니다. 액세스 토큰은 요청 헤더로 전송하고, 리프레시 토큰은 서버가 관리하는 쿠키를 통해 재발급 흐름에 사용합니다.

서버 API의 요청·응답 및 인증 설정은 백엔드 README를 참고하세요.

## Docker 배포

```bash
docker build -t sangdari-frontend .
docker run --rm -p 8081:80 sangdari-frontend
```

Docker 이미지는 Node 기반 빌드 후 Nginx로 정적 파일을 제공합니다. Nginx는 Vue Router의 히스토리 모드 새로고침을 위해 모든 미해결 경로를 `index.html`로 연결합니다.

## 참고 사항

- 결제 기능은 토스페이먼츠 연동과 시연용 모의 결제 API를 함께 지원합니다.
- 프론트엔드 환경 변수는 빌드 시점에 포함됩니다. 운영 API 주소와 토스 클라이언트 키는 운영 빌드 전에 설정해야 합니다.
