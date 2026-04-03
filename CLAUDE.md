# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm run dev      # Start dev server at http://localhost:3000
pnpm run build    # Production build
pnpm run lint     # Run ESLint
```

테스트 러너는 별도 설정 없음 (tester 에이전트가 Vitest + Playwright 기준으로 작성).

## Tech Stack

- **Next.js 16.2.2** (App Router) — breaking changes 있음, 코드 작성 전 `node_modules/next/dist/docs/` 참고
- **React 19.2.4** / **TypeScript** strict / **Tailwind CSS v4** / **TanStack Query**
- `@/*` path alias → repo root

## 🤖 Agent Delegation

작업 유형에 따라 아래 전문 에이전트에게 위임한다. **직접 코드를 작성하기 전에 항상 적합한 에이전트가 있는지 먼저 판단한다.**

| 작업 유형                                  | 에이전트    |
| ------------------------------------------ | ----------- |
| API 연동, Network/Service/Hook 레이어 구현 | `developer` |
| 컴포넌트 UI, 디자인 토큰, 반응형, 접근성   | `ui-design` |
| 코드 품질 검수, 아키텍처 위반 리포트       | `reviewer`  |
| 단위/통합/E2E 테스트 작성                  | `tester`    |

### 복합 작업 순서

기능 전체를 구현할 때는 아래 순서로 에이전트를 순차 위임한다:

```
1. developer  → 비즈니스 로직 (Network → Service → Hook)
2. ui-design  → UI 컴포넌트
3. tester     → 테스트 작성
4. reviewer   → 최종 품질 검수
```

### 단독 작업 트리거 예시

- "~~ API 연동해줘" / "서비스 레이어 만들어줘" → `developer`
- "컴포넌트 만들어줘" / "디자인 토큰 추가해줘" → `ui-design`
- "코드 리뷰해줘" / "아키텍처 검수해줘" → `reviewer`
- "테스트 작성해줘" → `tester`
