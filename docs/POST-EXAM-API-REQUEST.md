# 사후검사 링크·응답 API 요청서 (백엔드 전달용)

> 작성 2026-09-28 · 프론트 `/admin`(운영자), `/after/{slug}`(응시자)
> 현재 Swagger `06. 사후 평가` 에는 참조 API 16개만 있고, 아래 9개가 없어 **사후검사 발송 · 사후검사 조회 · 기업 보고서 · 응시 화면**이 동작하지 않습니다.
> 프론트는 아래 계약대로 이미 구현되어 있습니다. 경로·필드 이름을 바꾸시면 알려 주세요. 프론트에서 맞추겠습니다.

## 0. 공통

| 항목 | 내용 |
|---|---|
| 성공 응답 | 기존과 같이 `{ "data": T }` |
| 오류 응답 | 기존 `ProblemDetail`(`status, detail, errorCode …`). 화면은 `detail` 을 그대로 띄웁니다 |
| 운영자 API | `Authorization: Bearer <token>`, `/auth/login/email` 로 받은 **role=SUPER_ADMIN** 토큰 (참조 API 16개와 같은 권한) |
| 공개 API | 토큰 없음 (응시자) |
| 날짜 / 시각 | `YYYY-MM-DD` / `YYYY-MM-DD HH:mm:ss` 문자열, 한국시간 |
| 빈 값 | 키를 빼지 말고 `null` |

**채점은 프론트가 합니다.** 백엔드는 응시자가 고른 원본 답만 저장하고 돌려주면 됩니다.
점수 계산, 통계, 보고서 저장은 필요 없습니다 (`exam_score`, `report` 테이블과 `exam_response` 의 점수 칼럼은 사용하지 않습니다).

### ⚠️ 함께 고쳐 주셨으면 하는 것 — 없는 경로가 401 로 옵니다

지금은 없는 경로를 부르면 404 가 아니라 **401 `CMN_101` "인증이 필요합니다"** 가 옵니다.
`/auth/signup/company/nonexistent` 처럼 인증 없이 열린 경로 아래에서도 똑같습니다.
그래서 프론트에서는 "API 가 아직 없음"과 "로그인 필요"를 구분할 수 없습니다.
Spring Security 가 404 를 `/error` 로 넘길 때 인증을 요구하는 경우가 흔한 원인이라, `/error` 를 permitAll 에 넣으면 해결될 가능성이 큽니다.

---

## 1. 목록

| # | 메서드 | 경로 | 권한 | 쓰는 화면 |
|---|---|---|---|---|
| L1 | GET | `/ops/links` | 운영자 | 사후검사 발송 · 조회, 기업 보고서 목록 |
| L2 | GET | `/ops/links/{linkId}` | 운영자 | 사후검사 조회 상세, 기업 보고서 상세 |
| L3 | POST | `/ops/links` | 운영자 | 사후검사 발송 — 링크 발급 |
| L4 | POST | `/ops/links/{linkId}/close` | 운영자 | 사후검사 발송 — 링크 마감 |
| L5 | GET | `/public/links/{slug}` | 공개 | 응시 화면 첫 진입 |
| R1 | POST | `/public/links/{slug}/check-name` | 공개 | 응시 화면 — 이름 중복 확인 |
| R2 | POST | `/public/links/{slug}/responses` | 공개 | 응시 화면 — 제출 |
| R3 | GET | `/ops/links/{linkId}/responses` | 운영자 | 사후검사 조회, 기업 보고서 (채점 원본) |
| R4 | POST | `/ops/responses/rematch` | 운영자 | 사후검사 조회 — "사전검사 다시 맞추기" 버튼 |

---

## 2. 링크

### 공통 응답 객체 `ExamLink` (L1 ~ L4)

| 필드 | 타입 | 설명 |
|---|---|---|
| `linkId` | number | 링크 번호 |
| `institutionId` | number | 링크를 받은 **학습 기업**의 기관 번호 (참조 API 의 `Institution.id`) |
| `safarionCode` | string | 발급 시점의 SafariOn 기관 코드 (`S0001234`) |
| `orgName` | string | 발급 시점의 기업명 |
| `slug` | string | 응시 주소 `/after/{slug}` |
| `courseTitle` | string \| null | 발급할 때 고른 교육 운영 건 제목 |
| `dueOn` | string | 마감일 `YYYY-MM-DD`. 그날 23:59(KST)까지 응시 가능 |
| `issuedAt` | string | 발급 시각 `YYYY-MM-DD HH:mm:ss` |
| `status` | `'open'` \| `'closed'` | 운영자가 마감(L4)하면 `closed`. 마감일 경과는 프론트가 따로 판단하므로 `open` 그대로 두셔도 됩니다 |
| `closedAt` | string \| null | 마감 처리 시각 |
| `offerings` | `{ offeringId: string; title: string }[]` | 연결된 교육 운영 건. 지금은 발급 시 1건 |
| `responseCount` | number | 이 링크로 제출된 응답 수 |

```json
{
  "linkId": 12,
  "institutionId": 1234,
  "safarionCode": "S0001234",
  "orgName": "헬로월드랩스",
  "slug": "helloworldlabs",
  "courseTitle": "AI 리터러시 과정",
  "dueOn": "2026-10-15",
  "issuedAt": "2026-09-28 14:03:11",
  "status": "open",
  "closedAt": null,
  "offerings": [{ "offeringId": "a1b2c3d4e5f6478990abcdef01234567", "title": "AI 리터러시 과정" }],
  "responseCount": 18
}
```

### L1. `GET /ops/links` — 링크 목록

- 응답 `data`: `ExamLink[]`, **발급 최신순**(`issuedAt` 내림차순)
- 마감된 링크도 포함합니다

### L2. `GET /ops/links/{linkId}` — 링크 하나

- 응답 `data`: `ExamLink`
- 없으면 **404**

### L3. `POST /ops/links` — 링크 발급

요청 본문

| 필드 | 타입 | 설명 |
|---|---|---|
| `operatorId` | number | 교육을 연 운영 기관 (`/offerings/for-issue` 의 `operatorId`) |
| `offeringId` | string | 그 기관의 교육 운영 건 (hex 32자) |
| `institutionId` | number | 링크를 받을 학습 기업 |
| `dueOn` | string | 마감일 `YYYY-MM-DD` |

응답 `data`: 만들어진 `ExamLink`

서버에서 확인해 주세요 (원본 시스템과 같은 규칙):

| 조건 | 응답 |
|---|---|
| `dueOn` 이 오늘(KST)보다 이전 | 400 |
| `offeringId` 가 `operatorId` 가 연 운영 건이 아님 (`/offerings/for-issue` 기준) | 400 |
| 운영 건에 `learningCompanyIds` 가 있는데 `institutionId` 가 그 안에 없음 | 400 |
| `learningCompanyIds` 가 비어 있는데 `institutionId` 가 사전검사 응시 기업(`/pre/orgs`)이 아님 | 400 |

`slug` 는 서버가 만듭니다:

- 기관 영문명(`Institution.englishName`)을 소문자로 바꾸고 `[a-z0-9-]` 만 남깁니다
- 다른 기업이 이미 같은 slug 를 쓰고 있으면 뒤에 `-{기관코드 숫자}` 를 붙입니다
- 같은 기업에 다시 발급하면 `-2`, `-3` … 을 붙입니다
- `preview`, `admin`, `api`, `login` 은 쓸 수 없습니다

`orgName`, `safarionCode` 는 발급 시점 값을 저장하고, `courseTitle` 은 고른 운영 건의 제목을 저장합니다.

### L4. `POST /ops/links/{linkId}/close` — 링크 마감

- 본문 없음. 행을 지우지 말고 `status = closed`, `closedAt` 을 기록해 주세요
- 응답 `data`: 바뀐 `ExamLink`
- 없으면 404. 이미 마감된 링크는 그대로 200 을 돌려주셔도 됩니다

### L5. `GET /public/links/{slug}` — 응시 화면용 링크 정보 (공개)

응시자는 참조 API(운영자 전용)를 부를 수 없어서, 화면에 띄울 이름을 백엔드가 정해 주셔야 합니다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `slug` | string | |
| `displayOrgName` | string | 링크를 받은 기관의 학습 기업(`/institutions/{id}/companies`)이 **정확히 1곳**이면 그 이름, 아니면 `orgName` |
| `courseTitle` | string \| null | |
| `dueOn` | string | `YYYY-MM-DD` |
| `closed` | boolean | `status = closed` 이거나 `dueOn` 이 오늘(KST)보다 이전이면 `true` |

- 없는 slug 는 **404**
- 마감된 링크도 404 가 아니라 200 + `closed: true` 로 주세요 (화면에 "마감되었습니다"를 띄웁니다)
- 운영자 정보(`linkId`, `institutionId`, 응답 수 등)는 넣지 마세요

---

## 3. 응답

### R1. `POST /public/links/{slug}/check-name` — 이미 낸 이름인지 확인 (공개)

- 요청 본문: `{ "name": "홍길동" }` — 프론트가 앞뒤 공백을 지우고, 연속 공백을 하나로 줄여 보냅니다
- 응답 `data`: `{ "used": boolean }` — 이 링크에 같은 `name_key` 로 낸 응답이 있으면 `true`
- `name_key` = 공백을 모두 지우고 소문자로 바꾼 이름
- 없는 slug 이거나 마감된 링크면 404
- 이름이 접근 로그에 남지 않도록 POST 로 받습니다

### R2. `POST /public/links/{slug}/responses` — 제출 (공개)

요청 본문

| 필드 | 타입 | 설명 |
|---|---|---|
| `name` | string | 2자 이상. R1 과 같은 방식으로 공백을 정리해 보냅니다 |
| `department` | string \| null | 지금 화면에서는 받지 않아 항상 `null` 입니다 |
| `instrumentVersion` | string | 문항 판 번호. 현재 `"2026-09-18"` |
| `answers` | object | 문항 코드 → 답. 아래 참고 |

`answers` — 36문항 전부 들어옵니다

| 문항 코드 | 유형 | 값 |
|---|---|---|
| `A1` ~ `A12` | 리커트 | 숫자 `1` ~ `5` |
| `B1` ~ `B12` | 상황판단 | 문자열 `"A"` ~ `"D"` |
| `C1` ~ `C12` | 행동 빈도 | 숫자 `1` ~ `5` |

```json
{
  "name": "홍길동",
  "department": null,
  "instrumentVersion": "2026-09-18",
  "answers": { "A1": 4, "A2": 5, "B1": "B", "B2": "C", "C1": 3 }
}
```

응답 `data`: `{ "responseId": number }`

| 조건 | 응답 |
|---|---|
| 없는 slug | 404 |
| 마감(`status = closed` 또는 `dueOn` 경과) | **410** |
| 같은 링크에 같은 `name_key` 가 이미 있음 | **409** |
| 36문항 중 빠진 문항이 있거나, 값이 범위를 벗어남 | **422** (또는 400) |

저장할 때 할 일:

- `exam_answer` 에는 받은 값을 **문자열 그대로** 저장합니다 (`"4"`, `"B"`). 채점 값은 저장하지 않습니다
- **사전검사 매칭**: 링크의 `institutionId` 로 사전검사 응시자(`/pre/orgs/{id}/members` 와 같은 데이터)를 찾습니다. `nameKey` 가 같은 사람이 **정확히 1명**이면 그 `userId` 를 `preUserId` 로, 시각을 `matchedAt` 으로 저장합니다. `department` 가 비어 있으면 그 사람의 부서를 넣습니다
  - 0명이거나 2명 이상(동명이인)이면 `preUserId = null` 로 저장합니다
  - 사전검사 조회가 실패해도 **제출은 저장**합니다
- 이름을 로그에 남기지 말아 주세요

### R3. `GET /ops/links/{linkId}/responses` — 링크의 응답 원본

- 응답 `data`: `PostResponseRaw[]`, **제출 순**(`submittedAt` 오름차순, 같으면 `responseId` 오름차순)
- 응답이 없으면 `[]`, 없는 링크면 404

`PostResponseRaw`

| 필드 | 타입 | 설명 |
|---|---|---|
| `responseId` | number | |
| `linkId` | number | |
| `institutionId` | number | 링크의 학습 기업 |
| `name` | string | 제출한 이름 (정리된 원문) |
| `department` | string \| null | 제출한 부서, 없으면 사전검사에서 가져온 부서 |
| `instrumentVersion` | string | 제출 당시 문항 판 |
| `preUserId` | number \| null | 짝지어진 사전검사 응시자 `userId`. 못 찾았으면 `null` |
| `matchedAt` | string \| null | 짝지은 시각 |
| `submittedAt` | string | 제출 시각 `YYYY-MM-DD HH:mm:ss` |
| `answers` | `{ itemCode: string; rawValue: string }[]` | 36개. `rawValue` 는 저장한 문자열 그대로 |

```json
{
  "responseId": 301,
  "linkId": 12,
  "institutionId": 1234,
  "name": "홍길동",
  "department": "개발팀",
  "instrumentVersion": "2026-09-18",
  "preUserId": 5021,
  "matchedAt": "2026-09-28 15:10:02",
  "submittedAt": "2026-09-28 15:10:02",
  "answers": [
    { "itemCode": "A1", "rawValue": "4" },
    { "itemCode": "B1", "rawValue": "B" }
  ]
}
```

### R4. `POST /ops/responses/rematch` — 사전검사 다시 맞추기

- 본문 없음
- `preUserId` 가 `null` 인 응답만 R2 와 같은 규칙으로 다시 찾습니다. 이미 짝지어진 응답은 건드리지 않습니다
- 응답 `data`: `{ "checked": number, "matched": number }` — 다시 찾아본 건수, 이번에 새로 짝지어진 건수

---

## 4. 있으면 좋은 것 (선택)

- **응답 일괄 조회** `GET /ops/responses?linkIds=1,2,3` → `PostResponseRaw[]`
  사후검사 조회와 기업 보고서 목록은 지금 링크마다 R3 을 한 번씩 부릅니다. 링크가 수십 개가 되면 느려지니, 이 API 가 생기면 프론트를 바꾸겠습니다.
- **감사 로그**: 링크 발급(L3), 링크 마감(L4), 응답 조회(R3)를 누가 언제 했는지 남겨 주시면 좋습니다. 별도 API 는 필요 없습니다.
