# 운영 관리자(/admin) · 사후검사(/after) API 요청서

AX_Compass_after(Next 15 + mysql2 직결)를 이 저장소로 옮기면서, 프론트는 DB 에 붙지 않고
`NEXT_PUBLIC_API_URL` 의 백엔드만 부른다. 아래는 프론트가 **가정하고 이미 구현한** 계약이다.
경로·필드는 협의로 바뀔 수 있다(서비스 코드에 `TODO(backend)` 표시).

## 0. 공통 규칙

| 항목 | 내용 |
|---|---|
| 기본 주소 | `NEXT_PUBLIC_API_URL` |
| 성공 응답 | 항상 `{ "data": T }` (이 저장소 `apiFetch` 규칙). 204 는 본문 없음 |
| 오류 응답 | RFC 9457 Problem Details (`ApiErrorDTO`: `type,title,status,detail,instance,errorCode,timestamp`). 화면은 `detail` 을 그대로 띄운다 |
| 인증 | `Authorization: Bearer <opsToken>` — 운영 관리자 전용 토큰. 기관 관리자 `adminToken` 과 **별개** |
| 토큰 만료·오류 | `401` + `errorCode: "CMN_102"`(만료) 또는 `"CMN_101"`(없음/잘못됨) → 프론트가 토큰 삭제 후 `/admin/login` 으로 보낸다 |
| 날짜 / 시각 | `YYYY-MM-DD` / `YYYY-MM-DD HH:mm:ss` **문자열**(KST) |
| 키 이름 | camelCase, 값이 없으면 키를 빼지 말고 `null` |

**채점·통계·보고서는 프론트가 읽을 때 계산한다.** 백엔드는 원본 답만 저장·반환한다.

- `exam_score` 테이블 **사용 안 함**(폐기 가능)
- `exam_response` 의 점수 칼럼(`overall, base_level, level, cap_reason, profile, profile_group, se, sj, bh, gap_sr, gap_sb`)과 `exam_answer.scored_value` 는 채우지 않는다 → **NULL 허용으로 변경 요청**
- `report` 테이블(발행 기록·`payload`) **사용 안 함** — 보고서 "생성" 기능 없음
- 문항 정의는 프론트에 정적 파일(`lib/admin/data/instrument-post.json`)로 있다. 시트 동기화 API 없음

권한 표기: **공개** = 토큰 없음 · **ops** = 로그인한 운영 관리자(SafariOn `SUPER_ADMIN`)

---

## 1. 참조 데이터 (기존 API-SPEC 16개)

> **반영 완료** — 백엔드 Swagger `06. 사후 평가` 에 같은 경로·필드로 올라왔다.
> 차이는 `PreOrgDetail.sections[].weight`, `competencies[].weight` 가 `number | null` 인 것뿐(`types/reference.ts` 반영).

AX_Compass_after `docs/API-SPEC.md` 의 16개를 **같은 경로·같은 모양**으로 이 백엔드에 올려 주기를 요청한다.
차이는 두 가지뿐이다 — 응답을 `{ data }` 로 감싸고, 인증은 **ops 토큰**으로 받는다.

| # | 메서드 | 경로 | 권한 | 응답 `data` |
|---|---|---|---|---|
| 1 | GET | `/institutions` | ops | `Institution[]` |
| 2 | GET | `/institutions/satisfaction` | ops | `InstitutionSatisfaction[]` |
| 3 | GET | `/institutions/{id}/companies` | ops | `string[]` |
| 4 | GET | `/institutions/{id}/satisfaction` | ops | `MetricAverage[]` |
| 5 | GET | `/institutions/{id}/cohorts` | ops | `InstitutionCohort[]` |
| 6 | GET | `/cohorts` | ops | `Cohort[]` |
| 7 | GET | `/offerings/for-issue` | ops | `OfferingForIssue[]` |
| 8 | GET | `/offerings/{offeringId}/questions` | ops | `QuestionBundle` |
| 9 | POST | `/offerings/satisfaction` | ops | `MetricAverage[]` |
| 10 | POST | `/offerings/curriculum` | ops | `CourseOverview[]` |
| 11 | POST | `/offerings/questions` | ops | `QuestionBundle` |
| 12 | POST | `/offerings/choices` | ops | `ChoiceQuestion[]` |
| 13 | GET | `/pre/orgs` | ops | `PreOrg[]` |
| 14 | GET | `/pre/orgs/{id}` | ops | `PreOrgDetail` (없으면 404) |
| 15 | GET | `/pre/orgs/{id}/members` | ops | `PreMember[]` |
| 16 | POST | `/pre/match` | ops | `NameHit[]` |

필드 정의: `types/reference.ts` (= API-SPEC 원문).

---

## 2. 운영 관리자 인증 — 확정 (요청 철회)

`POST /auth/login/email` 을 쓴다(구 `/auth/login/operator`). 기관 관리자도 같은 경로로 role=`ADMIN` 토큰을 받으므로 프론트가 JWT role 이 `SUPER_ADMIN` 이 아니면 로그인을 거부한다. 별도 `/ops/auth/*` 요청은 철회.

| 메서드 | 경로 | 권한 | 요청 | 응답 `data` |
|---|---|---|---|---|
| POST | `/auth/login/email` | 공개 | `{ email, rawPassword }` | `{ token }` |

- SafariOn 플랫폼 관리자 계정, 토큰 role=`SUPER_ADMIN`. 운영자 전용 사후평가 API 에서만 인증된다
- 실패: 401 `USR_005`, 429 `USR_017`(이메일당 15분 5회), 503 `USR_009`
- 토큰 없음/잘못됨 401 `CMN_101`, 만료 401 `CMN_102`, 운영자 토큰 아님 403. 프론트는 ops 토큰을 보낸 요청이 `CMN_101`/`CMN_102` 이면 토큰을 지우고 `/admin/login` 으로 보낸다
- logout / me / 비밀번호 변경 없음, `mustChangePassword` 개념 없음. 로그아웃은 브라우저 토큰 삭제로 처리

---

## 3. 운영 관리자 계정 — 확정 (요청 철회)

계정 관리는 SafariOn 에서 한다. `/ops/members` 요청은 철회하고, 프론트의 관리자 계정 화면도 삭제했다.

---

## 4. 사후검사 링크

> 백엔드 전달용 정리본은 `docs/POST-EXAM-API-REQUEST.md` (4·5절 내용을 필드 표·예시·오류 조건으로 풀어 씀).

| 메서드 | 경로 | 권한 | 요청 | 응답 `data` | 테이블 |
|---|---|---|---|---|---|
| GET | `/ops/links` | ops | — | `ExamLink[]` (`issued_at DESC`) | `exam_link`, `exam_link_offering`, `exam_response`(COUNT) |
| GET | `/ops/links/{linkId}` | ops | — | `ExamLink` (없으면 404) | 위와 같음 |
| POST | `/ops/links` | ops | `{ operatorId, offeringId, institutionId, dueOn }` | `ExamLink` | `exam_link`(insert, `issued_by`), `exam_link_offering`(insert 1건) |
| POST | `/ops/links/{linkId}/close` | ops | — | `ExamLink` | `exam_link.status='closed', closed_at, closed_by` |
| GET | `/public/links/{slug}` | 공개 | — | `PublicLink` (없으면 404) | `exam_link` (+ 참조 #3 학습 기업) |

`ExamLink`

```ts
{ linkId: number; institutionId: number; safarionCode: string; orgName: string; slug: string;
  courseTitle: string | null; dueOn: string; issuedAt: string; status: 'open' | 'closed';
  closedAt: string | null; offerings: { offeringId: string; title: string }[];
  responseCount: number }
```

`PublicLink` — 응시 화면이 참조 API(ops 전용)를 부를 수 없으므로 표시 이름을 백엔드가 정해 준다.

```ts
{ slug: string;
  displayOrgName: string;   // 학습 기업(참조 #3)이 정확히 1개면 그 이름, 아니면 org_name
  courseTitle: string | null; dueOn: string;
  closed: boolean }         // status='closed' 이거나 dueOn < 오늘(KST)
```

발급 검증(원본 `POST /api/admin/links` 와 동일, 백엔드에서 수행)

- `dueOn` 이 오늘(KST)보다 이르면 400
- `offeringId` 가 `operatorId` 의 운영 건이 아니면 400 (참조 #7)
- 운영 건에 학습 기업이 연결돼 있으면 그 안에서만, 없으면 사전검사 응시자가 있는 기업(참조 #13)만 400
- `slug` 는 서버가 생성: 영문명 소문자·`[a-z0-9-]`, 다른 기업과 겹치면 `-{코드숫자}`, 같은 기업 재발급이면 `-2, -3…`. 예약어 `preview, admin, api, login` 금지
- `org_name, safarion_code` 는 발급 시점 값 저장, `course_title` = 고른 운영 건 제목

---

## 5. 사후검사 응답

| 메서드 | 경로 | 권한 | 요청 | 응답 `data` | 테이블 |
|---|---|---|---|---|---|
| POST | `/public/links/{slug}/check-name` | 공개 | `{ name }` | `{ used: boolean }` | `exam_response` (`link_id + name_key`) |
| POST | `/public/links/{slug}/responses` | 공개 | `{ name, department, instrumentVersion, answers }` | `{ responseId }` | `exam_response`(insert), `exam_answer`(insert) |
| GET | `/ops/links/{linkId}/responses` | ops | — | `PostResponseRaw[]` (`submitted_at, response_id` 오름차순) | `exam_response`, `exam_answer` |
| POST | `/ops/responses/rematch` | ops | — | `{ checked, matched }` | `exam_response.pre_user_id, department, matched_at` |

제출 본문

```ts
{ name: string;                        // 2자 이상, 공백은 하나로 맞춰 보냄
  department: string | null;
  instrumentVersion: string;           // instrument-post.json meta.parsedAt
  answers: Record<string, number | string> }  // A1..C? → 리커트 1~5 / 상황판단 'A'~'D'
```

제출 처리

| 조건 | 응답 |
|---|---|
| 없는 slug / check-name 에서 마감 링크 | 404 |
| 마감(`closed`) | 410 |
| 같은 링크·같은 `name_key` | 409 (`uq_response_person`) |
| 문항 누락 (instrument 의 모든 `item_code` 가 있어야 함) | 422 |

- `name_key` = 공백 제거 + 소문자
- 저장 시 사전검사 매칭: 참조 #15 에서 `nameKey` 가 **정확히 1명**이면 `pre_user_id`, `matched_at` 기록, `department` 가 비었으면 그 사람 부서로. 사전검사 조회 실패해도 저장은 한다
- `exam_answer.raw_value` 에 적은 그대로 문자열 저장. `scored_value` 는 NULL
- 로그에 이름 남기지 않기

`PostResponseRaw`

```ts
{ responseId: number; linkId: number; institutionId: number; name: string;
  department: string | null; instrumentVersion: string;
  preUserId: number | null; matchedAt: string | null; submittedAt: string;
  answers: { itemCode: string; rawValue: string }[] }
```

재매칭: `pre_user_id IS NULL` 인 응답만 위 규칙으로 다시 맞춘다. 이미 맞춘 건 건드리지 않는다.

---

## 6. 감사 로그

`audit_log` 기록 대상(백엔드 내부 처리, 별도 API 없음): `link.issue`, `link.close`, `response.view`
(`GET /ops/links/{id}/responses`).

## 7. 미결 사항

1. ~~참조 16개 응답 형식~~ — `{ data }` + Problem Details 로 반영 완료
2. ~~`mustChangePassword` 중 차단 여부~~ — 개념 없음(철회)
3. 링크 목록 화면이 링크마다 `GET /ops/links/{id}/responses` 를 부른다. 링크가 많아지면 일괄 조회(`GET /ops/responses?linkIds=`) 추가 필요
4. `exam_response` 점수 칼럼 NULL 허용 변경 또는 삭제
