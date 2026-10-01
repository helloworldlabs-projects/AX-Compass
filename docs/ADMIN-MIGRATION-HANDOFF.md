# AX_Compass_after → ax_compas `/admin` 이관 — 인수인계 (2026-09-29 갱신)

## 목표

`C:/dev/AX_Compass_after`(Next 15, mysql2 로 post DB 직접 접근)를 이 저장소 `/admin` 하위로 이관.
**DB 직접 접근 금지.** 모든 통신은 `NEXT_PUBLIC_API_URL` + `api/client.ts`의 `apiFetch`.

## 확정된 결정

1. 응시 화면은 `/admin` 밖 공개 경로 `/after/[slug]`
2. 채점(ax-scoring)·보고서 계산은 프론트가 한다. **원본과 같이** 채점은 제출할 때 해서 점수를 함께 저장(R2),
   보고서는 "생성하기"로 계산한 전문을 발행(P3)하고 상세는 발행 전문(P2)을 그린다
3. 문항은 `lib/admin/data/instrument-post.json` 커밋으로 관리 (앱 내 구글 시트 동기화 기능 제거)
4. 운영 관리자 토큰 키는 `axcompass:opsToken` (기존 `axcompass:adminToken`은 기관 관리자용, 섞지 말 것)
5. 백엔드: `NEXT_PUBLIC_API_URL=http://192.168.0.13:8082/api`,
   Swagger `http://192.168.0.13:8082/api/swagger-ui/index.html` (그룹 `06. 사후 평가`, JSON `/api/v3/api-docs/06. 사후 평가`)
6. 운영자 로그인은 `POST /auth/login/email` `{ email, rawPassword }` → `{ token }` (SafariOn 관리자 계정, role=SUPER_ADMIN).
   계정 관리·비밀번호 변경·me·logout API 없음 → 해당 화면/코드 **삭제함** (`/admin/members`, `/admin/account`, opsMember 계층)
7. 테스트 작성 안 함. 커밋은 사용자가 직접 한다 (에이전트는 커밋 금지)

## 완료 (미커밋)

- 데이터 계층: `types/{reference,opsAuth,postLink,postResponse}.ts`, `api/services|keys/*` 같은 이름,
  `hooks/use{Reference,OpsAuth,PostLink,PostResponse,CompanyReport,OpsToken}.ts`
- 참조 API 16개: Swagger 와 경로·필드 일치 확인 (`PreOrgDetail` 의 `weight` 만 `number | null` 로 수정)
- 로그인: `/auth/login/email` 연동(JWT role 이 `SUPER_ADMIN` 아니면 거부). 로그아웃은 클라이언트에서 토큰·캐시만 지움. 가드는 토큰 유무만 확인
- `api/client.ts`: 401 `CMN_102` 는 요청 토큰 삭제, ops 토큰을 보냈는데 401 `CMN_101` 이어도 삭제 후 `/admin/login`
- 화면: `app/admin/**`, `app/after/[slug]`, `components/admin/**`, `components/after/ExamFlow.tsx`
- 스타일: `app/admin/admin.css`, `app/globals.css` 첫 `@theme` 에 `--color-adm-{brand,point,line-soft,track-fill}`
  (작업 중 globals.css 가 되돌려져 있어 다시 넣음)
- `docs/ADMIN-API-REQUEST.md`: 1~3절 확정 반영, 4·5절(링크·응답)은 미구현 요청으로 남음
- `tsc`, `pnpm run build` 통과. lint 는 이 작업과 무관한 기존 파일 4건 오류(`components/ax-report/*`, `CurriculumTreeChart`)

## 2026-09-29 사후검사 API 연동 (Swagger `06. 사후 평가` 기준)

백엔드가 요청서(`POST-EXAM-API-REQUEST.md`)가 아니라 원본 DB 모델대로 만들어서 그 계약에 맞췄다. 요청서는 이제 참고용.

| API | 쓰는 곳 |
|---|---|
| L1·L2·L4·L5 링크 목록/상세/발급/마감 | `postLink.service` · 발급 본문 `{institutionId, courseTitle, dueOn, offeringIds[]}` |
| L6 공개 링크 (`accepting`) | `/after/[slug]` |
| R1 이름 확인(`taken`) · R2 제출(점수 포함) | `ExamFlow` · 본문은 `lib/admin/post-results.ts` `buildSubmitBody` (원본 saveResponse 와 같은 값) |
| R3 응답(저장된 점수) · R6 태그 평균 | 사후검사 조회, 보고서 계산 |
| R4 링크 응답 수 | 보고서 상세 "발행 뒤 응답 늘었음" 경고 |
| R5 전체 응답 수 | 사후검사 발송 목록 |
| P1·P2·P3 보고서 목록/상세/발행 | 기업 보고서 목록(발행일·판·생성하기), 상세(발행 전문) · `postReport.service`, `usePostReport` |
| P4 링크별 다시 맞추기 | `RematchButton linkId` |

- 안 붙인 것: **L3 `/ops/links/issue-options`** — 사전검사 인원·만족도 평균·발급 가능 여부가 없어 원본 화면을 못 그림. 기존 참조 API 조합(`lib/admin/issue-options.ts`) 유지
- R6 은 소수 둘째 자리라 프론트에서 첫째 자리로 다시 반올림(`ponytail:` 주석)
- 확인 못 함: dev 서버의 사후검사 DB 가 503 `CMN_502` 라 실데이터로 화면 확인 못 함
- 원본 보고서 전문(payload)과 `CompanyReport` 모양이 같아 원본에서 발행한 보고서도 그대로 그려짐 (`ExamLink.responseCount` 제거로 맞춤)

## 2026-09-28 확인된 사실

- **메뉴 3개(발송·조회·보고서)가 로그인 화면으로 튕김 — 원인 확정.**
  백엔드는 없는 경로에 404 대신 **401 `CMN_101`** 을 준다(정상 SUPER_ADMIN 토큰으로도 `/ops/links` → 401 CMN_101 확인).
  `api/client.ts` 의 "ops 토큰 보냈는데 CMN_101 이면 로그아웃" 규칙이 이를 잘못된 토큰으로 보고 `/admin/login` 으로 보냄.
  잘못된/위조 토큰은 백엔드가 `CMN_102`("유효하지 않은 토큰입니다")로 주므로 CMN_101 규칙은 불필요 → **제거 예정(사용자 승인 대기)**
- `/cohorts` 실데이터(dev, 회차 20개, 테스트 데이터) 로 운영 대시보드 수치 재계산 → 화면과 일치
- 대시보드·`overallScore`·사후검사 대상(COMPLETED & enrolled>0, 앞 6개, 시작일 최신순) 로직은 **원본과 동일**.
  원본도 회차 목록은 `/cohorts` 참조 API 사용(DB 직결은 post-db 쪽만)
- 원본부터 있던 특성: 대시보드 지표 평균은 회차 평균의 단순 평균(응답 수 가중 없음), 응답은 있는데 `scores` 가 빈 회차(#14)는 "미수집"
- 로그인 여러 개 공존 검토 결과는 아래 "로그인 구조" 참고

## 로그인 구조 (이 저장소)

| 대상 | 경로 | 토큰 키 | 만료/잘못 시 |
|---|---|---|---|
| 참여자 | `/auth/login` | `axcompass:accessToken` | `/` |
| 기관 관리자 | `/auth/login/admin/email`, `/auth/login/admin/code` | `axcompass:adminToken` | `/` |
| 운영자 | `/auth/login/email` (+ 프론트 role=SUPER_ADMIN 확인) | `axcompass:opsToken` | `/admin/login` |

- 키·Query Key 네임스페이스가 분리되어 있어 같은 브라우저에서 동시 로그인해도 섞이지 않음
- 주의: `/auth/login/email` 은 기관 관리자(ADMIN)도 로그인됨 → 백엔드가 기관 관리자 로그인을 이쪽으로 통합하면 메인 사이트 로그인 수정 필요
- 주의: 백엔드 설명상 토큰을 쿠키로도 받을 수 있음. 현재 `apiFetch` 는 `credentials` 를 쓰지 않아 쿠키 영향 없음. 운영에서 같은 도메인·쿠키 인증을 도입하면 세 로그인이 쿠키 하나를 덮어쓸 수 있음

## 다음 할 일

1. `api/client.ts` CMN_101 로그아웃 규칙 제거 (사용자 승인 대기). 없는 경로는 여전히 401 CMN_101 이지만 화면이 부르는 경로는 이제 다 있음
2. 사후검사 DB 가 살아나면 발급 → 응시 → 조회 → 보고서 생성까지 실데이터 확인
3. 배포(환경별 `NEXT_PUBLIC_API_URL`, CORS, 원본 앱 종료·리다이렉트) → QA(원본 앱 결과와 대조 후 원본 종료)
4. reviewer: 최종 검수

## Jira 티켓 초안 (사용자 요청, 목록형)

- 완료: ① 화면 `/admin`·`/after` 이관 ② DB 직접 조회 → API 연동 전환 ③ 운영자 로그인 연동
- 예정: ④ 없는 API 시 로그인 튕김 수정 ⑤ 링크·응답 API 연동(선행: BE 9개) ⑥ 개선·최종 검수 ⑦ 배포 ⑧ QA
- Atlassian MCP 미인증이라 직접 등록 안 함. 본문은 사용자가 붙여 넣기

## 알려진 잔여 이슈

- `useScoredPostResponses`, `useScoredPostResponsesByLinks`, `useIssueOptions`, `useCompanyReport` 가 `refetch` 를 반환하지 않음
- 보고서 인쇄용 폰트 크기 덮어쓰기가 `components/admin/report` 안에 있음 → `admin.css` 로 옮길 것 (`ponytail:` 주석)
- post·reports 목록은 링크마다 응답 API 호출(N+1) → 링크 많아지면 일괄 조회 API 요청
- 원본 `cohorts/[id]`(목데이터 전용) 미이관
