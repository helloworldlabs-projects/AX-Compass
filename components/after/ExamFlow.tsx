'use client';

import { useEffect, useState } from 'react';

import { useCheckPostResponseName, useSubmitPostResponse } from '@/hooks/usePostResponse';
import type { Answers, Section } from '@/lib/admin/ax-scoring';
import { EXAM_ITEMS, LIKERT_LABELS, SECTIONS, type ExamItem } from '@/lib/admin/instrument';
import { cn } from '@/lib/utils';
import { ApiError, getApiErrorDetail } from '@/types/common';

/**
 * 사후검사 응시 화면.
 *
 * 한 화면에 한 문항. 섹션(자기평가 → 상황판단 → 행동빈도)마다 안내를 먼저 보여준다.
 *
 * 링크는 기업 단위 공통 링크라 링크만으로는 응시자를 특정할 수 없다.
 * 그래서 맨 앞에 이름을 받는다. 이 이름이 사전검사 기록과 이어붙이는 유일한
 * 열쇠이므로, 사전검사 때와 다르게 적으면 그 사람은 향상도 계산에서 빠진다.
 *
 * 제출할 때 채점해 원본 답과 점수를 함께 보낸다 (lib/admin/post-results buildSubmitBody).
 */

export interface ExamCohort {
  org: string;
  title: string;
  course: string;
  /** 마감일 YYYY-MM-DD. 마감으로 제출이 막혔을 때 안내에 쓴다. */
  dueOn?: string;
}

type Step =
  | { kind: 'identify' }
  | { kind: 'intro' }
  | { kind: 'section-intro'; section: Section }
  | { kind: 'item'; item: ExamItem; indexInExam: number }
  | { kind: 'done' };

function buildSteps(): Step[] {
  const steps: Step[] = [{ kind: 'identify' }, { kind: 'intro' }];
  let n = 0;
  for (const s of SECTIONS) {
    steps.push({ kind: 'section-intro', section: s.id });
    for (const item of EXAM_ITEMS.filter((i) => i.section === s.id)) {
      steps.push({ kind: 'item', item, indexInExam: ++n });
    }
  }
  steps.push({ kind: 'done' });
  return steps;
}

const STEPS = buildSteps();
const TOTAL_ITEMS = EXAM_ITEMS.length;

const DUPLICATE_NAME =
  '이미 제출한 이름입니다. 같은 이름으로 두 번 응시할 수 없습니다. 이름을 다르게 적으셨다면 고쳐 주시고, 응시한 적이 없다면 교육 담당자에게 문의해 주세요.';

/**
 * 제출 실패 안내. 응시자가 36문항을 다 푼 뒤에 보는 문구라 원본과 같은 말로 고정한다.
 * 그 밖의 오류는 서버가 준 이유를, 연결 자체가 안 됐으면 그 사실을.
 */
function submitErrorText(error: unknown, dueOn?: string): string {
  if (error instanceof ApiError) {
    if (error.errorCode === 'OPS_203') {
      return '이미 제출한 이름입니다. 같은 이름으로 두 번 응시할 수 없습니다. 본인이 제출한 적이 없다면 교육 담당자에게 문의해 주세요.';
    }
    if (error.errorCode === 'OPS_202') {
      return `${dueOn ? `${dueOn} 에 ` : ''}종료된 검사입니다. 교육 담당자에게 문의해 주세요.`;
    }
    if (error.status === 404) return '발급되지 않은 주소입니다. 교육 담당자에게 문의해 주세요.';
    return error.detail || '제출하지 못했습니다. 잠시 뒤 다시 눌러 주세요.';
  }
  return (
    getApiErrorDetail(error) ?? '인터넷 연결을 확인해 주세요. 응답은 아직 제출되지 않았습니다.'
  );
}

export function ExamFlow({
  slug,
  cohort,
  preview = false,
}: {
  slug: string;
  /** 링크가 가리키는 기업. 공통 링크이므로 응시자 본인은 이름으로 특정한다. */
  cohort: ExamCohort;
  /** 관리자 미리보기. 제출해도 서버로 보내지 않는다. */
  preview?: boolean;
}) {
  const [at, setAt] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState('');
  /** 이미 낸 이름일 때의 안내. */
  const [nameError, setNameError] = useState<string | null>(null);

  const checkName = useCheckPostResponseName();
  /** 제출이 실패하면 완료 화면으로 넘기지 않는다. 다시 누를 수 있어야 한다. */
  const submitMutation = useSubmitPostResponse();
  const submitting = submitMutation.isPending;
  const checkingName = checkName.isPending;

  // 앞뒤 공백과 중간의 연속 공백을 정리한다. "김 영희"와 "김영희"가
  // 다른 사람으로 갈리는 것을 조금이라도 줄이기 위함이다.
  const normalizedName = name.trim().replace(/\s+/g, ' ');

  const step = STEPS[at];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / TOTAL_ITEMS) * 100);
  const isLastItem = step.kind === 'item' && step.indexInExam === TOTAL_ITEMS;

  const currentAnswer = step.kind === 'item' ? answers[step.item.id] : undefined;
  const canAdvance =
    step.kind === 'identify'
      ? normalizedName.length >= 2
      : step.kind !== 'item' || currentAnswer !== undefined;

  const advance = () => setAt((i) => Math.min(i + 1, STEPS.length - 1));

  /**
   * 이름을 적고 넘어갈 때 한 번 확인한다.
   *
   * 같은 이름으로 두 번 낼 수 없다는 것은 제출할 때도 막지만, 그때는 이미
   * 36문항을 다 푼 뒤다. 여기서 걸러 주면 응시자가 헛수고를 하지 않는다.
   *
   * 확인에 실패했다고 검사를 막지는 않는다. 서버가 잠깐 답하지 않는 것과
   * 이미 응시한 것은 다른 일이고, 진짜 중복이면 제출할 때 다시 걸린다.
   */
  const advanceFromName = () => {
    if (preview) return advance();
    setNameError(null);
    checkName.mutate(
      { slug, name: normalizedName },
      {
        onSuccess: (used) => (used ? setNameError(DUPLICATE_NAME) : advance()),
        onError: advance,
      },
    );
  };

  /**
   * 제출. 보내는 데 실패했는데 완료 화면을 띄우면, 응시자는 36문항을 다 풀고도
   * 아무것도 남지 않았다는 사실을 모른 채 창을 닫는다. 성공했을 때만 넘긴다.
   */
  const submit = () => {
    if (preview) return setAt(STEPS.length - 1);
    submitMutation.mutate(
      { slug, name: normalizedName, answers },
      { onSuccess: () => setAt(STEPS.length - 1) },
    );
  };

  /** 버튼과 Enter 가 똑같이 군다 — 이름 확인·제출을 건너뛰면 안 된다. */
  const primary = () => {
    if (!canAdvance || submitting || checkingName) return;
    if (isLastItem) submit();
    else if (step.kind === 'identify') advanceFromName();
    else advance();
  };

  // 원본 검사와 동일하게 Enter 로 넘어간다. 매 렌더 다시 걸어 최신 상태를 본다.
  useEffect(() => {
    if (step.kind === 'done') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.isComposing) return;
      e.preventDefault();
      primary();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const sectionMeta =
    step.kind === 'item'
      ? SECTIONS.find((s) => s.id === step.item.section)
      : step.kind === 'section-intro'
        ? SECTIONS.find((s) => s.id === step.section)
        : null;

  /*
    상단 바가 지금 어느 화면인지를 말한다.

    예전에는 카드 안에도 같은 제목을 큰 글씨로 한 번 더 적었다. 같은 말이 두 번
    나오면서 세로 자리를 빼앗아, 과정명이 긴 기업에서는 아래가 잘렸다.
    제목은 상단 바에만 두고 카드는 내용으로 시작한다.

    안내 화면에서는 "Step 1. 자기평가" 처럼 몇 번째인지까지 적는다 — 문항 화면으로
    넘어가면 영역 이름만 남는다.
  */
  const barLabel =
    step.kind === 'identify'
      ? '응시자 확인'
      : step.kind === 'intro'
        ? '검사 시작 전 안내'
        : step.kind === 'section-intro' && sectionMeta
          ? sectionMeta.intro.title
          : sectionMeta
            ? `${sectionMeta.label}(${sectionMeta.english})`
            : '검사 완료';

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 pt-8 pb-32 lg:px-6 lg:pb-20">
      {/*
        상단 바 — 왼쪽에 섹션 이름, 오른쪽에 진행 게이지.

        좁은 화면에서도 한 줄에 둔다. 아래로 내리면 게이지가 화면 너비를 다 차지해
        남은 분량이 실제보다 길어 보인다. 대신 게이지를 줄이고 "진행 현황" 글자는
        감춘다 — 게이지 안에 퍼센트가 찍혀 있어 무엇인지 알 수 있다.
      */}
      <div className="flex items-center justify-between gap-3 rounded-[16px] bg-white px-4 py-3 shadow-sm lg:gap-4 lg:px-6">
        <span className="txt-b-bold min-w-0 truncate text-gray-900">{barLabel}</span>

        <div className="flex shrink-0 items-center gap-3">
          <span className="txt-c2-bold hidden shrink-0 whitespace-nowrap text-gray-500 lg:inline">
            진행 현황
          </span>

          {/* 빈 알약(트랙) 안에서 안쪽 알약이 응답률만큼 차오른다. 숫자가 잘리지 않게 최소 너비를 준다. */}
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="진행 현황"
            className="bg-special-dark-blue-100 h-7 w-[92px] rounded-full p-1 lg:h-10 lg:w-[200px]"
          >
            <div
              className="bg-special-dark-blue-500 flex h-full min-w-[42px] items-center justify-center rounded-full px-2 transition-[width] duration-300 ease-out lg:min-w-[60px] lg:px-3"
              style={{ width: `${progress}%` }}
            >
              <span className="txt-c2-bold text-white tabular-nums lg:text-[14px]">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 검사 영역 높이를 고정한다. 단계를 넘길 때마다 화면이 출렁이지 않게. */}
      <div className="mt-5 min-h-[560px] lg:h-[580px]">
        {step.kind === 'identify' && (
          <Identify
            cohort={cohort}
            preview={preview}
            name={name}
            onChange={(v) => {
              setName(v);
              // 이름을 고치면 앞서 받은 안내는 더 이상 이 이름의 것이 아니다.
              if (nameError) setNameError(null);
            }}
            error={nameError}
          />
        )}

        {step.kind === 'intro' && <Intro />}

        {step.kind === 'section-intro' && sectionMeta && <SectionIntro meta={sectionMeta} />}

        {step.kind === 'item' && (
          <ItemCard
            key={step.item.id}
            item={step.item}
            number={step.indexInExam}
            value={currentAnswer}
            onAnswer={(v) => setAnswers((prev) => ({ ...prev, [step.item.id]: v }))}
          />
        )}

        {step.kind === 'done' && <Done answered={answeredCount} total={TOTAL_ITEMS} />}
      </div>

      {/*
        모바일에서는 버튼을 화면 하단에 고정한다. 문항 길이에 상관없이 늘 같은 자리에 있어야
        연달아 누르기 편하다. 데스크톱에서는 가운데 정렬하고 ENTER 배지를 버튼 오른쪽에 띄운다.
      */}
      {step.kind !== 'done' && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-100 bg-white px-4 py-3 lg:static lg:mt-8 lg:flex lg:flex-col lg:items-center lg:justify-center lg:border-0 lg:bg-transparent lg:p-0">
          {submitMutation.isError && (
            <div
              role="alert"
              className="border-special-pink-200 bg-special-pink-0 mb-3 rounded-[16px] border px-4 py-3 lg:max-w-[640px]"
            >
              <p className="txt-b-bold text-special-pink-600">
                {submitErrorText(submitMutation.error, cohort.dueOn)}
              </p>
              <p className="txt-b-regular mt-1 text-gray-500">
                지금 창을 닫으면 응답이 사라집니다. 이 화면을 열어 둔 채 다시 제출해 주세요.
              </p>
            </div>
          )}
          <div className="relative w-full lg:w-auto">
            <button
              type="button"
              disabled={!canAdvance || submitting || checkingName}
              onClick={primary}
              className="bg-adm-brand h-14 w-full rounded-[10px] px-10 text-[16px] leading-[150%] font-bold text-white transition disabled:cursor-not-allowed disabled:bg-gray-200 lg:w-auto"
            >
              {isLastItem
                ? submitting
                  ? '제출 중…'
                  : '제출하기'
                : checkingName
                  ? '확인 중…'
                  : '다음으로'}
            </button>
            <span className="txt-c2-bold bg-special-orange-500 pointer-events-none absolute top-1/2 left-full ml-3 hidden -translate-y-1/2 rounded-full px-3 py-1.5 whitespace-nowrap text-white lg:inline-block">
              ENTER 대응
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 안내 화면 ───────────────────────────────────────────── */

const SCREEN_CLASS =
  'rounded-[16px] flex h-full flex-col justify-center overflow-y-auto border border-gray-100 bg-white px-4 py-8 lg:px-8';

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-0 rounded-[16px] px-4 py-4 lg:px-6 lg:py-5">
      <p className="txt-st2-bold text-gray-900">{title}</p>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  );
}

/*
  안내 한 줄.

  txt-c1 은 캡션용이라 좁은 화면에서 12px 에 줄간격 130% 다. 한 줄짜리 꼬리표에는
  맞지만 여러 줄로 감기는 한글 문단에는 빡빡하고 작다. 응시자가 휴대폰으로 읽는
  글이므로 본문 크기(txt-b, 줄간격 150%)로 둔다.
*/
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="txt-b-regular flex gap-2 text-gray-500">
      <span aria-hidden="true" className="text-gray-400">
        ·
      </span>
      <span>{children}</span>
    </li>
  );
}

function Identify({
  cohort,
  preview,
  error,
  name,
  onChange,
}: {
  cohort: ExamCohort;
  /** 관리자 미리보기인가. 맞으면 실제 응시와 헷갈리지 않게 표시한다. */
  preview: boolean;
  name: string;
  /** 이미 제출한 이름일 때의 안내. 없으면 평소 안내를 보여준다. */
  error: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <section className={SCREEN_CLASS}>
      <div className="mx-auto w-full max-w-[560px]">
        {/* 링크를 잘못 받은 사람이 스스로 알아챌 수 있도록 소속을 먼저 보여준다. */}
        <div className="bg-special-blue-100 rounded-[16px] px-5 py-6 text-center lg:px-8">
          <p className="txt-c1-bold text-special-blue-500">아래 교육의 사후검사입니다</p>

          <p className="txt-t3 text-adm-brand mt-3">{cohort.org}</p>

          {/*
            과정 이름 옆 구분은 미리보기일 때만 — 실제 응시가 아니라는 사실이 화면 안에
            붙어 있어야 한다.

            실제 과정명은 "[메인비즈 아산지회] [역량강화 : n8n] 에이전틱 워크플로우를…"
            처럼 길다. 좁은 화면에서 서너 줄로 감기므로 알약(rounded-full) 대신 상자로
            둔다 — 여러 줄이 되면 알약 모양이 무너진다. break-keep 으로 낱말 가운데서
            줄이 갈리지 않게 한다.
          */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="txt-b-bold max-w-full rounded-[16px] bg-white px-4 py-2 break-keep text-gray-900">
              {cohort.title}
            </span>
            {preview && (
              <span className="txt-c1-bold rounded-full bg-white/60 px-3 py-2 text-gray-500">
                {cohort.course}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="respondent-name" className="txt-b-bold text-gray-900">
            이름
          </label>
          {/* Enter 는 ExamFlow 의 window 리스너가 받는다. 여기서 또 받으면 확인 요청이 두 번 나간다. */}
          <input
            id="respondent-name"
            type="text"
            value={name}
            autoFocus
            autoComplete="off"
            maxLength={30}
            placeholder="이름을 입력해 주세요"
            aria-invalid={!!error}
            aria-describedby="respondent-name-help"
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              'txt-b-regular bg-gray-0 mt-2 h-14 w-full rounded-[10px] border px-4 outline-none placeholder:text-gray-500',
              error ? 'border-special-pink-600' : 'focus:border-adm-brand border-gray-100',
            )}
          />
          {/* 이미 낸 이름이면 그 사실을 먼저 알린다. 평소 안내와 자리를 나눠 쓰면 무엇이 문제인지 흐려진다. */}
          {error ? (
            <p
              id="respondent-name-help"
              role="alert"
              className="txt-c1-bold text-special-pink-600 mt-2.5"
            >
              {error}
            </p>
          ) : (
            <p id="respondent-name-help" className="txt-b-regular text-special-pink-600 mt-2.5">
              본인의 이름을 적어 주세요. 사전검사를 하셨다면 그때와 <b>똑같은 이름</b>으로 적어
              주세요.
            </p>
          )}
        </div>

        <div className="bg-gray-0 mt-6 rounded-[16px] px-5 py-4">
          <p className="txt-b-regular text-gray-500">
            기업에 전달되는 보고서에는{' '}
            <b className="text-gray-900">개인 이름이나 개인별 점수가 표시되지 않으며</b>, 결과는
            팀·조직 단위로만 집계됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className={cn(SCREEN_CLASS, 'lg:py-10')}>
      <div className="space-y-4">
        <Panel title="검사 구성 안내">
          <Bullet>
            <b className="text-gray-900">자기 평가</b> — 현재 나의 AI 이해 수준과 활용 자신감을
            돌아보고 응답하는 평가입니다.
          </Bullet>
          <Bullet>
            <b className="text-gray-900">상황 판단</b> — 실제 업무와 유사한 AI 활용 상황에서 더
            적절한 판단을 선택하는 평가입니다.
          </Bullet>
          <Bullet>
            <b className="text-gray-900">행동 빈도</b> — 업무에서 AI를 얼마나 자주 활용하고
            실천하는지 돌아보고 응답하는 평가입니다.
          </Bullet>
        </Panel>

        <Panel title="응답 방식 안내">
          <Bullet>
            가장 올바르게 보이는 답을 찾기보다, 현재 나에게 가장 가까운 응답을 선택해 주세요.
          </Bullet>
          <Bullet>
            문항마다 오래 고민하기보다, 평소의 생각과 AI를 사용하는 방식에 따라 자연스럽게 답해
            주세요.
          </Bullet>
        </Panel>

        <Panel title="진행 유의사항">
          <Bullet>검사는 문항 단위로 진행되며, 이전 문항으로 돌아가 수정할 수 없습니다.</Bullet>
          <Bullet>
            총 {TOTAL_ITEMS}문항이며, 5분 내외가 걸립니다. 중간에 나가면 처음부터 다시 진행해야
            합니다.
          </Bullet>
        </Panel>
      </div>
    </section>
  );
}

function SectionIntro({ meta }: { meta: (typeof SECTIONS)[number] }) {
  return (
    <section className={cn(SCREEN_CLASS, 'lg:py-10')}>
      {/* 왼쪽에 안내, 오른쪽에 문항 예시. 좁은 화면에서는 안내가 먼저 온다. */}
      <div className="grid items-start gap-4 md:grid-cols-2 md:gap-6">
        <div className="space-y-4">
          <Panel title="평가 안내">
            {meta.intro.guide.map((g) => (
              <Bullet key={g}>{g}</Bullet>
            ))}
          </Panel>
          <Panel title="주의사항">
            {meta.intro.caution.map((c) => (
              <Bullet key={c}>{c}</Bullet>
            ))}
          </Panel>
        </div>

        <Example src={meta.intro.example.src} alt={meta.intro.example.alt} />
      </div>
    </section>
  );
}

/**
 * 문항 예시. 이미지 파일이 없을 수 있다. 깨진 이미지 아이콘이 뜨면 응시자가
 * 검사 자체를 의심하게 되므로, 실패하면 조용히 자리만 남긴다.
 */
function Example({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="text-center">
      <p className="txt-c1-bold text-gray-500">[문항 예시]</p>

      {failed ? (
        <div className="bg-gray-0 mt-3 flex min-h-[180px] items-center justify-center rounded-[16px] border border-dashed border-gray-100 px-4">
          <p className="txt-c1-regular text-gray-500">예시 이미지 준비 중</p>
        </div>
      ) : (
        // next/image 는 폭 계산이 어긋나 눌리는 일이 있어 그대로 img 를 쓴다.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="mt-3 w-full rounded-[16px]"
        />
      )}
    </div>
  );
}

/* ── 문항 화면 ───────────────────────────────────────────── */

function ItemCard({
  item,
  number,
  value,
  onAnswer,
}: {
  item: ExamItem;
  number: number;
  value: number | string | undefined;
  onAnswer: (v: number | string) => void;
}) {
  return (
    <section className="flex h-full flex-col">
      {/* 좁은 화면에서는 Q번호를 위로 올려 문항 글이 눌리지 않게 한다. (<header> 는 호스트 인쇄 CSS 가 숨긴다) */}
      <div className="bg-adm-brand flex shrink-0 flex-col overflow-hidden rounded-[16px] lg:min-h-[86px] lg:flex-row lg:items-stretch">
        <div className="txt-st2-bold flex shrink-0 items-center px-4 pt-3 pb-1 text-white lg:w-[92px] lg:justify-center lg:px-0 lg:py-0">
          Q{number}
        </div>
        <div className="txt-b-bold mx-3 mb-3 flex flex-1 items-center rounded-[10px] bg-white px-4 py-3.5 text-gray-900 lg:my-3 lg:mr-3 lg:ml-0 lg:px-5 lg:py-4">
          {item.prompt}
        </div>
      </div>

      <div className="mt-4 flex flex-1 items-center overflow-y-auto rounded-[16px] border border-gray-100 bg-white px-4 py-6 lg:px-8 lg:py-8">
        <div className="w-full">
          {item.type === 'SJT' ? (
            <OptionChoice item={item} value={value as string | undefined} onAnswer={onAnswer} />
          ) : (
            <StarScale
              section={item.section}
              value={value as number | undefined}
              onAnswer={onAnswer}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function StarScale({
  section,
  value,
  onAnswer,
}: {
  section: Section;
  value: number | undefined;
  onAnswer: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value || 0;
  const [low, mid, high] = LIKERT_LABELS[section];

  // 별과 라벨을 같은 5칸 격자에 올린다. 그래야 라벨이 1·3·5번째 별 바로 아래에 온다.
  const labels = [low, '', mid, '', high];

  return (
    <div className="mx-auto max-w-[420px]">
      <div
        role="radiogroup"
        aria-label="응답"
        className="grid grid-cols-5 justify-items-center gap-3"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n}점`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onAnswer(n)}
            className="transition-transform hover:scale-110 motion-reduce:transition-none"
          >
            <Star filled={n <= shown} />
          </button>
        ))}
      </div>

      <div className="mt-5 border-t border-gray-100 pt-3">
        <div className="grid grid-cols-5 justify-items-center gap-3">
          {labels.map((label, i) => (
            <span key={i} className="txt-c1-bold text-center whitespace-pre-line text-gray-700">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/*
  별 하나.

  크기를 화면에 맞춘다. 42px 고정이면 좁은 화면에서는 손가락으로 누르기에 빠듯하고,
  넓은 화면에서는 남는 자리에 비해 작아 보인다.
*/
function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="text-special-orange-500 size-[44px] lg:size-[56px]"
    >
      <path
        d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9L12 2.6z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OptionChoice({
  item,
  value,
  onAnswer,
}: {
  item: ExamItem;
  value: string | undefined;
  onAnswer: (v: string) => void;
}) {
  return (
    <ul role="radiogroup" aria-label="보기" className="space-y-4 lg:space-y-5">
      {item.options.map((o) => {
        const selected = value === o.code;
        return (
          <li key={o.code}>
            {/* 라디오는 보기 카드 바깥에 둔다. 카드 안에 넣으면 보기 글이 길어질 때 세로 중앙이 흔들린다. */}
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onAnswer(o.code)}
              className="flex w-full items-center gap-3 text-left lg:gap-5"
            >
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full transition lg:size-6',
                  selected ? 'ring-special-orange-500 bg-white ring-2' : 'bg-gray-200',
                )}
              >
                {selected && <span className="bg-special-orange-500 size-3 rounded-full" />}
              </span>

              <span
                className={cn(
                  'flex min-w-0 flex-1 items-center gap-2 rounded-[16px] px-2.5 py-2.5 transition lg:gap-4 lg:px-4 lg:py-3',
                  selected
                    ? 'bg-special-navy-200'
                    : 'bg-adm-track-fill hover:bg-special-dark-blue-100',
                )}
              >
                <span className="txt-b-bold w-6 shrink-0 text-center text-gray-900 lg:w-9 lg:text-[20px]">
                  {o.code})
                </span>
                <span className="txt-b-regular min-w-0 flex-1 rounded-[10px] bg-white px-3 py-2.5 text-gray-700 shadow-sm lg:px-5 lg:py-3.5">
                  {o.text}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ── 완료 ────────────────────────────────────────────────── */

function Done({ answered, total }: { answered: number; total: number }) {
  return (
    <section className="flex h-full flex-col justify-center rounded-[16px] border border-gray-100 bg-white px-4 py-16 text-center lg:px-8 lg:py-20">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
        <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="txt-t3 mt-6 text-gray-900">검사가 완료되었습니다</h1>
      <p className="txt-b-regular mt-3 text-gray-500">
        {total}문항 중 {answered}문항에 응답하셨습니다.
        <br />
        결과는 교육 담당자를 통해 기업 단위 보고서로 전달됩니다.
      </p>
      <p className="txt-b-regular mt-8 text-gray-500">이제 창을 닫으셔도 됩니다.</p>
    </section>
  );
}
