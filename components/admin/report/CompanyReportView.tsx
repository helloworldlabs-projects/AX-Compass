import { Badge, EmptyState, ROW_CLASS, Table, Td } from '@/components/admin/ui';
import { SECTION_WEIGHT } from '@/lib/admin/ax-scoring';
import {
  competencyInsight,
  conclusion,
  courseInsight,
  departmentInsight,
  levelInsight,
  overallInsight,
  profileInsight,
  satisfactionInsight,
  sectionInsight,
} from '@/lib/admin/insight';
import { with_ } from '@/lib/admin/josa';
import {
  METRICS,
  MIN_GROUP_SIZE,
  SCALE_MAX,
  educationTypeName,
  levelOf,
  score,
  stageOf,
} from '@/lib/admin/metrics';
import { recommendCourses, type Recommendation } from '@/lib/admin/recommend';
import { LEVEL_NAMES, type CompanyReport } from '@/lib/admin/report';
import { pText, stars } from '@/lib/admin/stats';
import { cn } from '@/lib/utils';
import type { ChoiceQuestion, CourseOverview, FreeTextQuestion } from '@/types/reference';
import {
  CHART_COLORS,
  DivergingBars,
  InlineBars,
  Legend,
  QuadrantWithLegend,
  Radar,
  SEGMENT_COLORS,
  SingleRadar,
  StackedShare,
} from './Charts';
import {
  Block,
  Caveat,
  Chapter,
  CoverSheet,
  Figure,
  Insight,
  Lead,
  TableCaption,
  TableNote,
  TestLine,
  delta,
  deltaTone,
} from './ReportParts';

/** 영역 배점을 문장에 넣을 때 쓰는 표기. 3:5:2 처럼 적는다. */
const SECTION_WEIGHT_TEXT = [SECTION_WEIGHT.A, SECTION_WEIGHT.B, SECTION_WEIGHT.C]
  .map((w) => Math.round(w * 10))
  .join(':');

/**
 * 프로필 레이더의 축 순서(12시에서 시계방향).
 * 바라는 모습(균형·실행·판단형)이 삼각형으로 보이도록 짰다. 비중 순으로 늘어놓으면
 * 기업마다 축이 뒤바뀌어 두 보고서를 나란히 놓고 견줄 수 없다.
 */
const PROFILE_RADAR_ORDER = ['BALANCED', 'OVERCONFIDENT', 'DOER', 'CAUTIOUS', 'ANALYST', 'LEARNER'];

/** 교육이 바라는 도착 유형. 어디서 왔는지는 보지 않는다. */
const DESIRED_PROFILES = ['BALANCED', 'DOER', 'ANALYST'];

/** 종합 제언에서 갈래마다 싣는 줄 수. 근거는 해당 장에 그대로 남아 있다. */
const CONCLUSION_LINES = 3;

/** 한 지면에 넣는 교육 회차 수. 이보다 많으면 다음 쪽으로 넘긴다. */
const COURSES_PER_SHEET = 6;

/** 서술형 응답에서 문장으로 올릴 것을 고르는 기준이 되는 최소 길이. */
const MEANINGFUL_LENGTH = 8;

/**
 * 등급 띠의 색. 색상 자체를 갈라(회색·보라·파랑·초록) 좁은 띠에서도 옆 칸과 구분되게 하고,
 * 밝기는 위로 갈수록 낮아지게 두어 흑백으로 뽑아도 순서가 읽힌다.
 */
const LEVEL_COLORS = [
  'var(--color-gray-200, #c4c4c4)', // 입문
  'var(--color-purple-400, #a771ff)', // 초급
  'var(--color-special-blue-500, #2e75cc)', // 중급
  'var(--color-green-600, #02a067)', // 고급
];

/**
 * 인쇄 지면(210mm ≈ 794px)은 호스트 PC 글자 기준(1024px)보다 좁아 모바일 글자로 찍힌다.
 * 원본 인쇄본은 PC 글자였으므로 인쇄할 때만 PC 값을 되돌린다.
 * ponytail: 보고서 전용 규칙이라 여기 둔다. admin.css 의 @media print 로 옮기면 더 깔끔하다.
 */
const PRINT_TYPE =
  'print:[--font-size-h2:54px] print:[--font-size-t3:28px] print:[--font-size-st:24px] print:[--font-size-st2:20px] print:[--font-size-c1:14px] print:[--font-size-c2:12px]';

/**
 * 검사 종합 보고서 본문(표지 + 12장).
 *
 * 사전검사 리포트의 장 구성을 그대로 따르고, 각 장에 사후와 변화를 더한다.
 * 화면이 곧 인쇄본이다 — 장마다 쪽이 나뉘고 표는 쪽 경계에서 잘리지 않는다(admin.css).
 * 수치를 꾸미지 않는다. 응답이 적으면 적다고 적고, 검정이 서지 않으면 왜인지를 그 자리에 적는다.
 */
export function CompanyReportView({ r, date }: { r: CompanyReport; date: string }) {
  const { org } = r.pre;
  const lowCoverage = r.coverage.rate !== null && r.coverage.rate < 50;
  const { picks } = recommendCourses(r);
  const summary = conclusion(r, picks);
  // 프로필 해설은 두 지면에 나눠 싣는다. 한 번만 계산해 둔다.
  const profileIns = profileInsight(r);

  return (
    <div className={cn('report-pages', PRINT_TYPE)}>
      <CoverSheet org={r.link.org} title={['교육 전후 종합 보고서']} date={date} />

      {/* ── 01 핵심 요약 ─────────────────────────────────── */}
      <Chapter
        no="01"
        title="핵심 요약"
        description="교육 전후의 역량 변화와 교육 만족도를 한눈에 봅니다. 아래 장에서 각 수치가 어디서 나왔는지 차례로 풀어 설명합니다."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4 print:grid-cols-2">
          <Figure
            label="사전 종합 역량"
            value={score(r.overall.pre)}
            unit="점"
            sub={`${levelOf(r.overall.pre) ?? '—'} · ${r.coverage.preN}명`}
          />
          <Figure
            label="사후 종합 역량"
            value={score(r.overall.post)}
            unit="점"
            sub={`${levelOf(r.overall.post) ?? '—'} · ${r.coverage.postN}명`}
          />
          <Figure
            label="변화"
            value={delta(r.overall.diff)}
            unit="점"
            sub={r.overall.welch.usable ? `효과 크기 ${r.overall.welch.effect}` : '검정 불가'}
            tone={deltaTone(r.overall.diff)}
          />
          <Figure
            label="교육 만족도"
            value={r.satisfaction.overall ?? '—'}
            unit={`/ ${SCALE_MAX}`}
            sub={
              r.satisfaction.respondents > 0
                ? `${r.satisfaction.respondents}명 · ${r.satisfaction.cohorts}개 회차`
                : '수집 전'
            }
          />
        </div>

        <Block title="진단 요약">
          <dl className="divide-adm-line-soft divide-y">
            {[
              // 전부 내려간 기업도 있다. "가장 많이 오른"이라고 적어 두면 −20점짜리에 그 이름이 붙는다.
              ...extremes(r.competencies),
              [
                '프로필 유형',
                r.profile.rows.length === 0
                  ? '—'
                  : `${r.profile.rows[0].name}이 가장 많습니다 (사후 ${r.profile.rows[0].postShare}%)`,
              ],
              [
                '응답 범위',
                `사전 ${r.coverage.preN}명 중 ${r.coverage.postN}명이 사후에 응했습니다${
                  r.coverage.rate === null ? '' : ` (응답률 ${r.coverage.rate}%)`
                }. 이름이 이어진 사람은 ${r.coverage.matchedN}명입니다.`,
              ],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-6 py-3 first:pt-0 last:pb-0">
                <dt className="txt-c1-bold w-40 shrink-0 text-gray-900">{label}</dt>
                <dd className="txt-c1-regular text-gray-700">{value}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="교육 만족도 요약">
          {r.satisfaction.metrics.length === 0 ? (
            <EmptyState message="아직 수집된 만족도 응답이 없습니다." />
          ) : (
            <>
              <div className="grid gap-3 lg:grid-cols-4 print:grid-cols-4">
                <Figure
                  label="전체 만족도"
                  value={r.satisfaction.overall ?? '—'}
                  unit={`/ ${SCALE_MAX}`}
                />
                <Figure label="교육 회차" value={r.satisfaction.cohorts} unit="개" />
                <Figure label="응답" value={r.satisfaction.respondents} unit="명" />
                <Figure
                  label="수강"
                  value={r.satisfaction.courses.reduce((a, c) => a + c.enrolled, 0)}
                  unit="명"
                />
              </div>

              {/* 지표별로 한 줄씩. 막대는 모두 같은 색 — 가장 낮은 지표에 경고색을 칠하면 높은 점수도 흠으로 읽힌다. */}
              <div className="mt-5 space-y-2">
                {[...r.satisfaction.metrics]
                  .filter((m) => m.mean !== null)
                  .sort((a, b) => b.mean! - a.mean!)
                  .map((m) => (
                    <div key={m.code} className="flex items-center gap-3">
                      <span className="txt-c1-regular w-[92px] shrink-0 text-gray-500">
                        {m.label}
                      </span>
                      <span className="block h-2 flex-1 rounded-full bg-gray-100">
                        <span
                          className="bg-adm-brand block h-2 rounded-full"
                          style={{ width: `${(m.mean! / SCALE_MAX) * 100}%` }}
                        />
                      </span>
                      <span className="txt-c1-bold w-[46px] shrink-0 text-right text-gray-900 tabular-nums">
                        {m.mean}
                      </span>
                    </div>
                  ))}
              </div>
              <p className="txt-c2-regular mt-2 text-right text-gray-500">
                막대는 {SCALE_MAX}점 만점 기준입니다
              </p>
            </>
          )}
        </Block>

        {lowCoverage && (
          <Caveat>
            사후검사에 응한 사람이 사전 응시자의 {r.coverage.rate}%입니다. 절반에 못 미치므로, 아래
            변화를 <b className="text-gray-900">기업 전체의 변화</b>라고 말하기 어렵습니다. 응답한
            사람들이 한쪽으로 쏠렸을 가능성을 함께 고려해 주세요.
          </Caveat>
        )}
      </Chapter>

      {/* ── 02 교육 개요 ─────────────────────────────────── */}
      <Chapter
        no="02"
        title="교육 개요"
        description="이 보고서가 다루는 교육이 무엇인지 먼저 밝힙니다. 아래의 모든 수치는 이 과정들을 거친 뒤에 측정한 것입니다."
      >
        <Lead>
          {[
            // 보고서를 받는 기업은 교육을 받은 쪽이다. "진행했습니다"는 운영 기관의 말이다.
            `${with_(r.link.org, '은')} 아래 ${r.satisfaction.courses.length}개 회차의 교육을 받았습니다. 회차 정보와 수강 인원은 SafariOn 운영 기록에서 그대로 가져왔습니다.`,
            '교육 만족도와 사후검사는 이 과정들을 마친 구성원을 대상으로 수집하였습니다.',
          ]}
        </Lead>

        {/* 과정이 하나면 회차 현황 표를 따로 두지 않는다. 바로 아래 과정 상세와 같은 말이다. */}
        {r.satisfaction.courses.length === 0 ? (
          <Block>
            <TableCaption>교육 회차 현황</TableCaption>
            <EmptyState message="연결된 교육 회차가 없습니다." />
          </Block>
        ) : (
          r.satisfaction.courses.length > 1 && (
            <Block>
              <TableCaption>교육 회차 현황</TableCaption>
              <CourseTable courses={r.satisfaction.courses.slice(0, COURSES_PER_SHEET)} />
            </Block>
          )
        )}

        {r.satisfaction.courses.length === 1 && r.satisfaction.overviews[0] && (
          <CourseDetail course={r.satisfaction.overviews[0]} />
        )}

        <Insight insight={courseInsight(r)} />
      </Chapter>

      {/* 회차가 많으면 여섯씩 끊어 다음 쪽으로 잇는다. */}
      {chunk(r.satisfaction.courses.slice(COURSES_PER_SHEET), COURSES_PER_SHEET).map((group, i) => (
        <Chapter key={i} no="02" title="교육 개요" cont>
          <Block>
            <CourseTable courses={group} />
          </Block>
        </Chapter>
      ))}

      {/* 과정마다 한 쪽씩 내용을 편다. 소개 글과 모듈은 SafariOn 에 적힌 것을 그대로 옮긴다. */}
      {r.satisfaction.courses.length > 1 &&
        r.satisfaction.overviews.map((c) => (
          <Chapter key={c.offeringId} no="02" title="교육 개요" cont>
            <CourseDetail course={c} />
          </Chapter>
        ))}

      {/* ── 03 교육 만족도 ───────────────────────────────── */}
      <Chapter
        no="03"
        title="교육 만족도"
        description="SafariOn 설문 결과입니다. 이 보고서가 다루는 교육의 응답을 모아 지표별로 봅니다."
      >
        <Lead>
          {[
            '교육이 끝난 직후 수강생에게 받은 설문입니다. 뒤에 나오는 역량 변화가 "무엇이 달라졌는가"를 말한다면, 만족도는 "교육을 어떻게 받아들였는가"를 말합니다. 둘을 나란히 두어야 점수가 오르지 않은 이유나 오른 이유를 교육 쪽에서 찾을 수 있습니다.',
            '지표는 여섯입니다. 콘텐츠는 다룬 내용이 맞았는지, 강사는 설명이 닿았는지, 실습은 직접 해 볼 수 있었는지, 운영은 진행과 자료가 받쳐 주었는지, 학습 경험은 배우는 동안의 느낌이 어땠는지, 현업 적용은 배운 것을 자기 업무로 가져갈 수 있겠는지를 묻습니다.',
            '회차가 여럿이면 회차 평균을 다시 평균 내지 않고 응답 하나하나를 모아 계산합니다. 응답이 적은 회차가 많은 회차와 같은 무게를 갖지 않도록 하기 위해서입니다.',
          ]}
        </Lead>

        {r.satisfaction.metrics.length === 0 ? (
          <Block>
            <EmptyState message="수집된 만족도 응답이 없습니다." />
          </Block>
        ) : (
          <Block
            title="지표별 평균"
            description={`${r.satisfaction.cohorts}개 회차 · ${r.satisfaction.respondents}명 · ${SCALE_MAX}점 만점`}
          >
            <Table
              columns={['지표', '평균', '응답 수']}
              minWidth={560}
              columnWidths={[null, 90, 90]}
            >
              {r.satisfaction.metrics.map((m) => (
                <tr key={m.code} className={ROW_CLASS}>
                  <Td className="txt-c1-bold">{m.label}</Td>
                  <Td className="txt-c1-bold tabular-nums">{m.mean ?? '—'}</Td>
                  <Td className="text-gray-500 tabular-nums">{m.answers}건</Td>
                </tr>
              ))}
            </Table>
          </Block>
        )}

        <Insight insight={satisfactionInsight(r)} />
      </Chapter>

      {/* 문항별 결과. 어느 문항이 낮았는지 보여야 다음 회차에서 무엇을 고칠지 정해진다. */}
      {r.satisfaction.questions.length > 0 && (
        <Chapter no="03" title="교육 만족도" cont>
          <Block
            title="문항별 평균"
            description={`별점 문항 ${r.satisfaction.questions.length}개 · ${SCALE_MAX}점 만점`}
          >
            <Table
              columns={['문항', '지표', '평균', '응답']}
              minWidth={640}
              columnWidths={[null, 88, 72, 64]}
            >
              {r.satisfaction.questions.map((q) => (
                <tr key={q.questionId} className={ROW_CLASS}>
                  <Td>{q.content}</Td>
                  <Td className="text-gray-500">{metricLabel(q.metric)}</Td>
                  <Td className="txt-c1-bold tabular-nums">{q.mean}</Td>
                  <Td className="text-gray-500 tabular-nums">{q.answers}건</Td>
                </tr>
              ))}
            </Table>
            <TableNote>평균이 낮은 문항이 다음 회차에서 먼저 손볼 자리입니다.</TableNote>
          </Block>
        </Chapter>
      )}

      {/* 객관식 문항. 무엇을 더 바라는지가 여기서 나온다. */}
      {chunk(r.satisfaction.choices, 3).map((group, i) => (
        <Chapter key={`choice-${i}`} no="03" title="교육 만족도" cont>
          {group.map((q) => (
            <Block
              key={q.questionId}
              title={q.content}
              description={`응답 ${q.respondents}명 · 하나 선택`}
            >
              <ChoiceBars question={q} />
            </Block>
          ))}
        </Chapter>
      ))}

      {/* 서술형 응답. 내용이 있는 응답을 골라 그대로 싣고, 나머지는 건수로만 남긴다. */}
      {chunk(r.satisfaction.freeText, 3).map((group, i) => (
        <Chapter key={`free-${i}`} no="03" title="교육 만족도" cont>
          {group.map((q) => (
            <FreeTextBlock key={q.questionId} question={q} />
          ))}
        </Chapter>
      ))}

      {/* ── 04 읽는 기준 ─────────────────────────────────── */}
      <Chapter
        no="04"
        title="읽는 기준과 분석 가능 범위"
        description="이 보고서의 수치가 어떤 사람들로 계산되었는지, 각 분석을 어디까지 해석할 수 있는지 밝힙니다."
      >
        <Block title="비교의 기준">
          <ul className="txt-c1-regular space-y-2 text-gray-500">
            <li>
              · <b className="text-gray-900">사전</b>은 그 기업에서 사전검사를 치른 사람 전부(
              {r.coverage.preN}명), <b className="text-gray-900">사후</b>는 사후검사에 응답한 사람
              전부({r.coverage.postN}명)입니다. 같은 사람들이 아니므로, 변화의 일부는{' '}
              <b className="text-gray-900">응답한 사람이 달라</b> 생긴 차이입니다.
            </li>
            <li>
              · 이름이 사전검사와 이어진 {r.coverage.matchedN}명에 대해서는{' '}
              <b className="text-gray-900">같은 사람끼리의 변화</b>도 따로 냅니다. 두 결과가 크게
              갈리면, 그 자체가 응답이 한쪽으로 쏠렸다는 신호입니다.
            </li>
            <li>
              · 인원이 적으면 p 값은 나오지만 뜻이 약합니다. 그래서 차이의 크기(효과 크기)를 함께
              싣습니다.
            </li>
          </ul>
        </Block>

        <Block
          title="분석별 권장 기준"
          description="기준에 못 미치는 분석은 결과에 그 사실을 적었습니다."
        >
          <Table
            columns={['분석', '무엇을 보는가', '권장 기준', '이 보고서']}
            // 분석 이름과 권장 기준은 줄을 넘기지 않을 만큼 준다.
            minWidth={640}
            columnWidths={[136, null, 148, 84]}
          >
            {[
              {
                name: '종합·영역 변화',
                what: '사전·사후 평균과 통계 검정',
                need: '각 5명 이상',
                ok: r.coverage.preN >= 5 && r.coverage.postN >= 5,
              },
              {
                name: '같은 사람 변화',
                what: '이름이 이어진 사람의 전후 차이',
                need: '매칭 10명 이상',
                ok: r.coverage.matchedN >= 10,
              },
              {
                name: '역량별 변화',
                what: '이해·활용·평가·책임 네 가지',
                need: '각 10명 이상',
                ok: r.coverage.preN >= 10 && r.coverage.postN >= 10,
              },
              {
                name: '소속별 다변량 분석',
                what: '부서에 따라 역량 구성이 다른가',
                need: '(인원 − 부서 수) ≥ 4',
                ok: r.department.manovaPost.usable,
              },
              {
                name: '프로필 분포 변화',
                what: '유형 비중이 달라졌는가',
                need: '기대빈도 5 이상',
                ok: r.profile.chi2.usable && r.profile.chi2.smallCells <= 0.2,
              },
            ].map((row) => (
              <tr key={row.name} className={ROW_CLASS}>
                <Td className="txt-c1-bold">{row.name}</Td>
                <Td className="text-gray-500">{row.what}</Td>
                <Td className="text-gray-500 tabular-nums">{row.need}</Td>
                <Td>
                  {row.ok ? (
                    <Badge tone="success">기준 충족</Badge>
                  ) : (
                    <Badge tone="warn">참고용</Badge>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </Block>
      </Chapter>

      {/* ── 05 종합 역량 변화 ────────────────────────────── */}
      <Chapter
        no="05"
        title="종합 역량 변화"
        description="교육 전후의 종합 점수를 두 가지 방식으로 비교합니다. 전체 대 전체는 기업의 지금 수준을, 같은 사람끼리는 교육의 효과를 말합니다."
      >
        <Lead>
          {[
            `종합 역량 점수는 자기평가·상황판단·행동빈도 세 영역의 점수를 ${SECTION_WEIGHT_TEXT} 비중으로 묶고, 다시 이해·활용·평가·책임 네 역량의 가중치를 적용해 100점으로 환산한 값입니다.`,
            '두 가지로 견줍니다. 전체 대 전체는 사전에 응시한 전원과 사후에 응답한 전원을 맞대어 이 기업이 지금 어디에 서 있는지를 봅니다. 같은 사람끼리는 두 검사에 모두 응한 사람만 짝지어, 그 사람 안에서 얼마나 움직였는지를 봅니다.',
            '앞의 방식은 사람 구성이 달라 순수한 교육 효과라 말하기 어렵고, 뒤의 방식은 인원이 적어 기업 전체로 넓히기 어렵습니다. 그래서 둘을 나란히 싣고, 두 결과가 같은 방향을 가리키는지를 먼저 봅니다.',
          ]}
        </Lead>

        <div className="grid gap-4 lg:grid-cols-3 print:grid-cols-3">
          <Figure
            label="사전"
            value={score(r.overall.pre)}
            unit="점"
            sub={levelOf(r.overall.pre) ?? '—'}
          />
          <Figure
            label="사후"
            value={score(r.overall.post)}
            unit="점"
            sub={levelOf(r.overall.post) ?? '—'}
          />
          <Figure
            label="변화"
            value={delta(r.overall.diff)}
            unit="점"
            tone={deltaTone(r.overall.diff)}
          />
        </div>

        <TestLine
          label={`전체 대 전체 (Welch t 검정 · 사전 ${r.overall.welch.n1}명 vs 사후 ${r.overall.welch.n2}명)`}
          result={r.overall.welch}
          extra={
            r.overall.welch.usable
              ? `t = ${r.overall.welch.t}, df = ${r.overall.welch.df}, d = ${r.overall.welch.d} (${r.overall.welch.effect})`
              : undefined
          }
        />
        <TestLine
          label={`같은 사람끼리 (대응 t 검정 · ${r.overall.paired.n}명)`}
          result={r.overall.paired}
          extra={
            r.overall.paired.usable
              ? `${r.overall.paired.meanBefore} → ${r.overall.paired.meanAfter}, t = ${r.overall.paired.t}, dz = ${r.overall.paired.dz} · 오름 ${r.overall.paired.up}명 / 내림 ${r.overall.paired.down}명`
              : undefined
          }
        />

        <Insight insight={overallInsight(r)} />
      </Chapter>

      {/* ── 06 역량별 변화 ───────────────────────────────── */}
      <Chapter
        no="06"
        title="사전·사후 차이 분석 (t검증)"
        description="교육에 참여한 응시자들의 AX 역량 변화 수준을 확인하기 위해 사전검사와 사후검사 결과를 비교 분석했습니다."
      >
        <Lead>
          {[
            '분석 항목은 AX 역량검사의 주요 영역인 이해, 활용, 평가·개선, 책임·거버넌스로 구성하였으며, 각 영역별 평균 점수 변화와 통계적 유의성을 확인하였습니다.',
            `표 왼쪽은 사전 ${r.coverage.preN}명과 사후 ${r.coverage.postN}명을 맞댄 독립표본 t검증(Welch)입니다. 다만 사후 응답자 중 ${r.coverage.matchedN}명이 사전 응시자에도 포함되어 두 집단이 독립이라고 보기 어려우므로 참고값으로 읽어 주십시오. 교육의 효과는 표 오른쪽의 대응표본 t검증으로 판단합니다. 같은 ${r.coverage.matchedN}명 안에서의 변화만 보므로 응답자 구성 차이가 섞이지 않습니다.`,
            '표 아래 그림은 같은 수치를 네 역량의 형태로 나타낸 것입니다. 안쪽 선이 사전, 바깥쪽 선이 사후이며, 네 축이 고르게 벌어졌다면 전반적인 향상을, 한 축만 크게 벌어졌다면 해당 역량에 효과가 집중된 것을 뜻합니다.',
          ]}
        </Lead>

        <Block>
          <TableCaption>AX 역량검사 사전·사후 차이 분석</TableCaption>
          <Table
            columns={['역량', '구분', '평균', '표준편차', 't', 'p', '대응표본']}
            // 여덟 줄짜리 표라 줄 간격을 좁힌다. 그래야 아래 그림이 다음 쪽으로 밀리지 않는다.
            dense
            // p 칸은 "< .001***" 이 한 줄에 들어갈 만큼 준다.
            minWidth={640}
            columnWidths={[56, 56, 70, 80, 70, 96, null]}
          >
            {r.competencies.flatMap((c) => [
              <tr key={`${c.code}-pre`} className="border-adm-line-soft border-b">
                <Td className="txt-c1-bold" rowSpan={2}>
                  {c.short}
                </Td>
                <Td className="text-gray-500">사전</Td>
                <Td className="tabular-nums">{c.welch.mean1.toFixed(2)}</Td>
                <Td className="text-gray-500 tabular-nums">{c.welch.sd1.toFixed(3)}</Td>
                <Td className="tabular-nums" rowSpan={2}>
                  {c.welch.t === null ? '—' : c.welch.t.toFixed(3)}
                </Td>
                {/* 줄을 넘기지 않는다. 한 칸만 두 줄이 되면 표가 어긋난다. */}
                <Td className="txt-c1-bold whitespace-nowrap tabular-nums" rowSpan={2}>
                  {pText(c.welch.p)}
                  <span className="text-special-pink-600">{stars(c.welch.p)}</span>
                </Td>
                <Td className="text-gray-500 tabular-nums" rowSpan={2}>
                  {c.paired.usable
                    ? `t = ${c.paired.t?.toFixed(3)}, ${pPhrase(c.paired.p)} (${c.paired.n}명)`
                    : '인원 부족'}
                </Td>
              </tr>,
              <tr key={`${c.code}-post`} className={ROW_CLASS}>
                <Td className="text-gray-500">사후</Td>
                <Td className="txt-c1-bold tabular-nums">{c.welch.mean2.toFixed(2)}</Td>
                <Td className="text-gray-500 tabular-nums">{c.welch.sd2.toFixed(3)}</Td>
              </tr>,
            ])}
          </Table>
          <TableNote>* p &lt; .05, ** p &lt; .01, *** p &lt; .001</TableNote>
        </Block>

        {/* 바로 위 표를 모양으로 바꾼 그림. 범례를 옆에 두어 세로 자리를 아낀다. */}
        <Block>
          <TableCaption>사전·사후 역량 프로파일</TableCaption>
          <div className="flex items-center justify-center gap-6">
            <Radar
              axes={r.competencies.map((c) => ({ label: c.short, pre: c.pre, post: c.post }))}
              maxWidth={252}
            />
            <Legend
              direction="column"
              items={[
                { color: CHART_COLORS.PRE, label: '사전' },
                { color: CHART_COLORS.POST, label: '사후' },
              ]}
            />
          </div>
        </Block>
      </Chapter>

      <Chapter no="06" title="사전·사후 차이 분석 (t검증)" cont>
        <Block>
          <TableCaption>하위 역량 12가지 사전·사후 비교</TableCaption>
          {/* 한 표 안에 막대를 넣어, 숫자는 정확히 읽고 크기는 눈으로 짚게 한다. */}
          <Table
            columns={['하위 역량', '사전 → 사후', '사전', '사후', '변화']}
            minWidth={640}
            columnWidths={[null, 150, 62, 62, 68]}
          >
            {r.tags.map((t) => (
              <tr key={t.code} className={ROW_CLASS}>
                <Td className="text-gray-900">{t.name}</Td>
                <Td>
                  <InlineBars pre={t.pre} post={t.post} />
                </Td>
                <Td className="text-gray-500 tabular-nums">{score(t.pre)}</Td>
                <Td className="txt-c1-bold tabular-nums">{score(t.post)}</Td>
                <Td className={cn('txt-c1-bold tabular-nums', diffColor(t.diff))}>
                  {delta(t.diff)}
                </Td>
              </tr>
            ))}
          </Table>
          <p className="txt-c2-regular mt-1.5 text-right text-gray-500">
            막대는 위가 사전, 아래가 사후입니다
          </p>
        </Block>

        <Insight insight={competencyInsight(r)} />
      </Chapter>

      {/* ── 07 등급 분포 ─────────────────────────────────── */}
      <Chapter
        no="07"
        title="등급 분포"
        description="평균만 보면 '모두가 조금씩 오른 것'과 '몇 명이 크게 오른 것'이 같아 보입니다. 입문·초급·중급·고급으로 나눠 교육이 어느 층에 닿았는지 봅니다."
      >
        {r.levels.slice(0, 3).map((l) => (
          <LevelBlock key={l.name} l={l} />
        ))}
      </Chapter>

      <Chapter no="07" title="등급 분포" cont>
        {r.levels.slice(3).map((l) => (
          <LevelBlock key={l.name} l={l} />
        ))}

        <Insight insight={levelInsight(r)} />
      </Chapter>

      {/* ── 08 영역별 변화와 격차 ────────────────────────── */}
      <Chapter
        no="08"
        title="AX 역량 갭 변화 분석"
        description="응시자의 AX 역량 변화는 총점이나 영역별 평균 점수만으로는 충분히 설명하기 어렵습니다. 자기평가(SE)·상황판단(SJ)·행동빈도(BH) 사이의 차이를 비교해, 스스로 인식하는 수준과 실제 판단·행동 수준 사이의 변화를 확인합니다."
      >
        <Lead>
          {[
            '자기평가(SE)는 본인이 스스로 인식하는 AX 역량 수준을 뜻하고, 상황판단(SJ)은 실제 업무 상황에서 AI를 어떻게 활용하고 판단하는지를 보여줍니다. 행동빈도(BH)는 AI 활용 행동이 실제 업무에서 얼마나 반복적으로 나타나는지를 뜻합니다.',
            '인식-판단 갭(SE−SJ)이 양수이면 스스로를 실제보다 높게 보고 있다는 뜻이고, 판단-행동 갭(SJ−BH)이 양수이면 아는 것에 비해 실제로는 덜 하고 있다는 뜻입니다. 두 갭이 줄어들수록 역량 구조가 안정적이라고 봅니다.',
          ]}
        </Lead>

        <Block>
          <TableCaption>사전·사후 AX 역량 갭 변화</TableCaption>
          <Table
            columns={['구분', '사전 평균', '사후 평균', '증감']}
            minWidth={600}
            columnWidths={[200, null, null, 90]}
          >
            {[
              ...r.sections.map((x) => ({
                name: `${x.label}(${x.code === 'A' ? 'SE' : x.code === 'B' ? 'SJ' : 'BH'})`,
                pre: x.pre,
                post: x.post,
                diff: x.diff,
                strong: false,
              })),
              {
                name: '인식-판단 갭(SE−SJ)',
                pre: r.gaps.sr.pre,
                post: r.gaps.sr.post,
                diff: r.gaps.sr.diff,
                strong: true,
              },
              {
                name: '판단-행동 갭(SJ−BH)',
                pre: r.gaps.sb.pre,
                post: r.gaps.sb.post,
                diff: r.gaps.sb.diff,
                strong: true,
              },
            ].map((row) => (
              <tr key={row.name} className={cn(ROW_CLASS, row.strong && 'bg-gray-0')}>
                <Td className="txt-c1-bold">{row.name}</Td>
                <Td className="text-gray-500 tabular-nums">
                  {row.pre === null ? '—' : row.pre.toFixed(2)}
                </Td>
                <Td className="txt-c1-bold tabular-nums">
                  {row.post === null ? '—' : row.post.toFixed(2)}
                </Td>
                <Td className={cn('txt-c1-bold tabular-nums', diffColor(row.diff))}>
                  {delta(row.diff)}
                </Td>
              </tr>
            ))}
          </Table>
          <TableNote>
            갭은 두 영역 평균의 차이입니다. 0 에 가까울수록 인식과 실제가 맞물려 있습니다.
          </TableNote>
        </Block>

        <Insight insight={sectionInsight(r)} />
      </Chapter>

      <Chapter no="08" title="AX 역량 갭 변화 분석" cont>
        <Block
          title="영역별 통계 검정"
          description="사전은 사전검사 응시자 전부, 사후는 응답자 전부 기준입니다."
        >
          {/* 모양이 한쪽으로 찌그러졌는지는 표로 안 보인다. */}
          <div className="mb-6 flex flex-col items-center">
            <Radar axes={r.sections.map((x) => ({ label: x.label, pre: x.pre, post: x.post }))} />
            <Legend
              items={[
                { color: CHART_COLORS.PRE, label: '사전' },
                { color: CHART_COLORS.POST, label: '사후' },
              ]}
            />
          </div>

          <Table
            columns={['영역', '사전', '사후', '변화', '유의성', '효과 크기']}
            minWidth={620}
            columnWidths={[110, 80, 80, 80, null, null]}
          >
            {r.sections.map((s) => (
              <tr key={s.code} className={ROW_CLASS}>
                <Td className="txt-c1-bold">{s.label}</Td>
                <Td className="text-gray-500 tabular-nums">{score(s.pre)}</Td>
                <Td className="txt-c1-bold tabular-nums">{score(s.post)}</Td>
                <Td className={cn('txt-c1-bold tabular-nums', diffColor(s.diff))}>
                  {delta(s.diff)}
                </Td>
                <Td className="text-gray-500 tabular-nums">
                  {s.welch.usable ? (s.welch.significant ? '유의' : '유의하지 않음') : '—'}
                </Td>
                <Td className="text-gray-500 tabular-nums">
                  {s.welch.usable ? `${s.welch.d} (${s.welch.effect})` : '—'}
                </Td>
              </tr>
            ))}
          </Table>
        </Block>
      </Chapter>

      <Chapter no="08" title="AX 역량 갭 변화 분석" cont>
        <Lead>
          {[
            '같은 사람 안에서 세 영역이 얼마나 어긋나 있는지를 봅니다. 점수가 올랐더라도 어긋남이 그대로면, 아는 것과 하는 것 사이의 거리는 줄지 않은 것입니다.',
            '자기평가에서 상황판단을 뺀 값은 스스로를 어떻게 보는가와 실제 판단력의 거리입니다. 양수가 크면 실제보다 자신을 높게 보는 쪽이고, 음수가 크면 할 줄 알면서도 낮춰 보는 쪽입니다. 상황판단에서 행동빈도를 뺀 값은 판단과 실행의 거리로, 양수가 크면 알면서도 손대지 않는다는 뜻입니다.',
            '두 격차가 줄었는지는 같은 사람끼리 짝지어 검정합니다. 사전과 사후의 응답자가 달라 생긴 차이를 격차의 변화로 읽지 않기 위해서입니다.',
          ]}
        </Lead>

        <Block
          title="인식-실행 격차"
          description="스스로 매긴 점수(자기평가), 상황을 판단하는 힘(상황판단), 실제로 하는 빈도(행동빈도) 사이의 거리입니다."
        >
          <Table
            columns={['격차', '뜻', '사전', '사후', '변화']}
            minWidth={640}
            columnWidths={[170, null, 70, 70, 70]}
          >
            <tr className="border-adm-line-soft border-b">
              <Td className="txt-c1-bold">자기평가 − 상황판단</Td>
              <Td className="text-gray-500">음수면 실제 판단력보다 스스로를 낮게 봅니다</Td>
              <Td className="text-gray-500 tabular-nums">{score(r.gaps.sr.pre)}</Td>
              <Td className="txt-c1-bold tabular-nums">{score(r.gaps.sr.post)}</Td>
              <Td className="txt-c1-bold tabular-nums">{delta(r.gaps.sr.diff)}</Td>
            </tr>
            <tr className="border-adm-line-soft border-b">
              <Td className="txt-c1-bold">상황판단 − 행동빈도</Td>
              <Td className="text-gray-500">양수면 아는 것보다 덜 합니다</Td>
              <Td className="text-gray-500 tabular-nums">{score(r.gaps.sb.pre)}</Td>
              <Td className="txt-c1-bold tabular-nums">{score(r.gaps.sb.post)}</Td>
              <Td className="txt-c1-bold tabular-nums">{delta(r.gaps.sb.diff)}</Td>
            </tr>
            <tr>
              <Td className="txt-c1-bold">역량 간 편차</Td>
              <Td className="text-gray-500">
                가장 높은 역량과 낮은 역량의 차이. 줄면 고르게 올랐다는 뜻입니다
              </Td>
              <Td className="text-gray-500 tabular-nums">{score(r.gaps.spread.pre)}</Td>
              <Td className="txt-c1-bold tabular-nums">{score(r.gaps.spread.post)}</Td>
              <Td className="txt-c1-bold tabular-nums">{delta(r.gaps.spread.diff)}</Td>
            </tr>
          </Table>
        </Block>

        {/* "그 사람 안에서 거리가 좁혀졌는가" 를 묻는 것이라 같은 사람끼리 짝지은 검정을 싣는다. */}
        <TestLine
          label={`자기평가−상황판단 격차 변화 (같은 사람 ${r.gaps.sr.paired.n}명)`}
          result={r.gaps.sr.paired}
          extra={
            r.gaps.sr.paired.usable
              ? `${r.gaps.sr.paired.meanBefore} → ${r.gaps.sr.paired.meanAfter}`
              : undefined
          }
        />
        <TestLine
          label={`상황판단−행동빈도 격차 변화 (같은 사람 ${r.gaps.sb.paired.n}명)`}
          result={r.gaps.sb.paired}
          extra={
            r.gaps.sb.paired.usable
              ? `${r.gaps.sb.paired.meanBefore} → ${r.gaps.sb.paired.meanAfter}`
              : undefined
          }
        />
      </Chapter>

      {/* ── 09 소속별 차이 ───────────────────────────────── */}
      <Chapter
        no="09"
        title="소속 차이 다변량 분석 (MANOVA)"
        description="응시자의 AX 역량은 이해, 활용, 평가·개선, 책임·거버넌스의 하위 영역으로 나뉩니다. 소속 간 하위 영역별 차이를 확인하기 위해 다변량 분산분석을 실시하였습니다."
      >
        <Lead>
          {[
            '분석 대상은 응시자의 소속 정보를 기준으로 구분하였으며, 각 소속별 AX 역량 평균과 표준편차는 아래와 같습니다.',
            '역량 네 가지를 따로 네 번 검정하면 우연히 하나가 유의해질 확률이 그만큼 커지고, 역량끼리 서로 얽혀 있다는 사실도 버리게 됩니다. 그래서 네 가지를 한꺼번에 놓고 보는 다변량 분산분석을 먼저 쓰고, 그 결과가 유의할 때 역량별로 따로 들여다봅니다.',
          ]}
        </Lead>

        <Block>
          <TableCaption>소속별 AX 역량 하위 영역 기초 통계량</TableCaption>
          {r.department.stats.length === 0 ? (
            <EmptyState message="소속별로 나눌 응답이 없습니다." />
          ) : (
            <Table
              columns={[
                '구분',
                ...r.department.stats[0].byCompetency.map((c) => `${c.short} 평균 / 표준편차`),
              ]}
              minWidth={640}
              columnWidths={[132, null, null, null, null]}
            >
              {r.department.stats.map((d) => (
                <tr key={d.name} className={ROW_CLASS}>
                  {/* 인원은 다음 지면의 소속별 평균 표에 있어 여기서는 적지 않는다. */}
                  <Td className="txt-c1-bold">{d.name}</Td>
                  {d.byCompetency.map((c) => (
                    <Td key={c.code} className="tabular-nums">
                      {c.mean === null ? '—' : c.mean.toFixed(2)}
                      <span className="text-gray-500">
                        {' / '}
                        {c.sd === null ? '—' : c.sd.toFixed(3)}
                      </span>
                    </Td>
                  ))}
                </tr>
              ))}
            </Table>
          )}
        </Block>

        <Lead>
          {r.department.manovaPost.usable
            ? [
                `AX 역량 하위 영역별로 소속 간 차이가 있는지 분석한 결과, Wilks' Lambda = ${r.department.manovaPost.wilks}, F = ${r.department.manovaPost.f}, p = ${pText(r.department.manovaPost.p)} 로 나타났습니다.`,
                r.department.manovaPost.significant
                  ? '이는 소속에 따른 AX 역량 차이를 분석하는 모형이 통계적으로 적합함을 의미합니다. 이에 따라 각 하위 영역별 소속 차이 분석을 실시하였으며, 그 결과는 아래 표와 같습니다.'
                  : '소속에 따른 AX 역량 차이가 뚜렷하지 않다는 뜻입니다. 참고로 각 하위 영역별 결과를 아래에 싣습니다.',
              ]
            : [
                `소속별 다변량 분석은 실시하지 못했습니다. ${r.department.manovaPost.note ?? ''}`,
                '아래의 하위 영역별 분산분석 결과를 대신 읽어 주세요.',
              ]}
        </Lead>
      </Chapter>

      <Chapter no="09" title="소속 차이 다변량 분석 (MANOVA)" cont>
        <Lead>
          {[
            '앞의 다변량 분석이 네 역량을 한 묶음으로 보고 소속 간 차이를 물었다면, 아래 표는 역량을 하나씩 떼어 각각에 대해 같은 질문을 던진 것입니다. 묶어서는 차이가 없어도 특정 역량에서만 갈리는 경우가 있습니다.',
            '제곱합은 흩어진 정도를 부서 간과 부서 안으로 나눈 값이고, F 는 그 둘의 비입니다. 부서 간 흩어짐이 부서 안 흩어짐보다 뚜렷하게 클 때 F 가 커지고 p 가 작아집니다. η² 는 그 역량의 점수 차이 가운데 소속으로 설명되는 몫으로, 0.01 은 작음, 0.06 은 중간, 0.14 이상은 큼으로 봅니다.',
            '아래의 분산분석은 사후 점수를 기준으로 합니다. 이어지는 검정은 점수 자체가 아니라 사전에서 사후로 움직인 폭이 소속에 따라 달랐는지를 따로 묻습니다.',
          ]}
        </Lead>

        <Block>
          <TableCaption>소속 간 AX 역량 하위 영역에 대한 차이 분석</TableCaption>
          <Table
            columns={['역량', '제곱합', '자유도', '평균제곱', 'F', 'p', 'η²']}
            minWidth={640}
            columnWidths={[70, 100, 60, 100, 86, 72, 62]}
          >
            {r.department.manovaPost.perVariable.map((v) => (
              <tr key={v.name} className={ROW_CLASS}>
                <Td className="txt-c1-bold">{v.name}</Td>
                <Td className="text-gray-500 tabular-nums">
                  {v.anova.ssBetween === null ? '—' : v.anova.ssBetween.toFixed(3)}
                </Td>
                <Td className="text-gray-500 tabular-nums">{v.anova.df1 ?? '—'}</Td>
                <Td className="text-gray-500 tabular-nums">
                  {v.anova.msBetween === null ? '—' : v.anova.msBetween.toFixed(3)}
                </Td>
                <Td className="txt-c1-bold tabular-nums">
                  {v.anova.f === null ? '—' : v.anova.f.toFixed(3)}
                  <span className="text-special-pink-600">{stars(v.anova.p)}</span>
                </Td>
                <Td className="tabular-nums">{pText(v.anova.p)}</Td>
                <Td className="text-gray-500 tabular-nums">
                  {v.anova.eta2 === null ? '—' : v.anova.eta2.toFixed(3)}
                </Td>
              </tr>
            ))}
          </Table>
          <TableNote>* p &lt; .05, ** p &lt; .01, *** p &lt; .001</TableNote>
        </Block>

        <TestLine
          label={`소속에 따라 변화량이 다른가 (일원 분산분석 · 같은 사람 ${r.department.changeAnova.n}명)`}
          result={r.department.changeAnova}
          extra={
            r.department.changeAnova.usable
              ? `F(${r.department.changeAnova.df1}, ${r.department.changeAnova.df2}) = ${r.department.changeAnova.f}`
              : undefined
          }
        />
      </Chapter>

      {/* 소속별 평균은 지면을 따로 쓴다. 부서가 열 곳을 넘으면 표만으로 A4 한 쪽을 채운다. */}
      <Chapter no="09" title="소속 차이 다변량 분석 (MANOVA)" cont>
        <Lead>
          {[
            '부서마다 사전·사후 평균과 그 변화를 나란히 적었습니다. 앞의 검정이 "소속에 따른 차이가 통계적으로 뚜렷한가"를 묻는다면, 이 표는 실제로 어느 부서가 어디에서 어디로 갔는지를 그대로 보여 줍니다.',
            `사전 인원과 사후 인원이 다른 부서가 있습니다. 사후검사에 응하지 않은 사람이 있기 때문이며, 응답이 ${MIN_GROUP_SIZE}명에 못 미치는 부서는 표본 부족으로 표시했습니다. 그런 부서의 평균은 한두 사람의 점수에 크게 흔들리므로 부서 간 비교의 근거로 쓰지 않는 편이 좋습니다.`,
          ]}
        </Lead>

        <Block title="소속별 평균">
          <Table
            columns={['소속', '사전 인원', '사후 인원', '사전', '사후', '변화']}
            minWidth={640}
            columnWidths={[150, 72, 72, 76, 76, 76]}
          >
            {r.department.rows.map((d) => (
              <tr key={d.name} className={ROW_CLASS}>
                <Td className="txt-c1-bold">
                  <span className="flex items-center gap-2">
                    {d.name}
                    {d.preN > 0 && d.preN < MIN_GROUP_SIZE && <Badge tone="warn">표본 부족</Badge>}
                  </span>
                </Td>
                <Td className="text-gray-500 tabular-nums">{d.preN > 0 ? `${d.preN}명` : '—'}</Td>
                <Td className="text-gray-500 tabular-nums">{d.postN > 0 ? `${d.postN}명` : '—'}</Td>
                <Td className="text-gray-500 tabular-nums">{score(d.pre)}</Td>
                <Td className="txt-c1-bold tabular-nums">{score(d.post)}</Td>
                <Td className={cn('txt-c1-bold tabular-nums', diffColor(d.diff))}>
                  {delta(d.diff)}
                </Td>
              </tr>
            ))}
          </Table>
        </Block>

        <Insight insight={departmentInsight(r)} />
      </Chapter>

      {/* ── 10 프로필 유형 변화 ──────────────────────────── */}
      <Chapter
        no="10"
        title="프로필 변화 분석"
        description="응시자의 AX 역량 변화 양상을 보다 구체적으로 확인하기 위해 사전검사와 사후검사에서 나타난 프로필 유형 분포를 비교하였습니다."
      >
        <Lead>
          {[
            'AX 역량 프로필은 단순 점수 결과만으로 구분하는 것이 아니라, 자기평가·상황판단·행동빈도 결과를 종합하여 응시자의 AI 활용 특성과 역량 균형 수준을 유형화한 결과입니다.',
            '본 분석에서는 응시자를 균형형, 과신형, 실행형, 판단형, 조심형, 이해형으로 구분하였으며, 사전과 사후의 인원이 다르므로 인원이 아니라 비중으로 견줍니다.',
          ]}
        </Lead>

        <Block>
          <TableCaption>사전·사후 AX 역량 프로필 분포 비교</TableCaption>
          <div className="mb-6 space-y-6">
            <StackedShare
              rows={[
                {
                  label: `사전 ${r.coverage.preN}명`,
                  values: r.profile.rows.map((x) => x.preShare),
                },
                {
                  label: `사후 ${r.coverage.postN}명`,
                  values: r.profile.rows.map((x) => x.postShare),
                },
              ]}
              segments={r.profile.rows.map((x, i) => ({
                label: x.name,
                color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
              }))}
            />

            {/* 비중이 오른 유형과 내린 유형을 0 기준 좌우로 편다. */}
            <DivergingBars
              rows={r.profile.rows.map((x) => ({ label: x.name, value: x.diff }))}
              unit="%p"
            />
          </div>

          <Table
            columns={['유형', '사전 인원', '사전 비중', '사후 인원', '사후 비중', '변화']}
            minWidth={640}
            columnWidths={[96, 80, 80, 80, 80, 80]}
          >
            {r.profile.rows.map((p) => (
              <tr key={p.id} className={ROW_CLASS}>
                <Td className="txt-c1-bold">{p.name}</Td>
                <Td className="text-gray-500 tabular-nums">{p.preN}명</Td>
                <Td className="text-gray-500 tabular-nums">{p.preShare}%</Td>
                <Td className="txt-c1-bold tabular-nums">{p.postN}명</Td>
                <Td className="txt-c1-bold tabular-nums">{p.postShare}%</Td>
                <Td className={cn('txt-c1-bold tabular-nums', diffColor(p.diff))}>
                  {delta(p.diff, '%p')}
                </Td>
              </tr>
            ))}
          </Table>
        </Block>
      </Chapter>

      <Chapter no="10" title="프로필 변화 분석" cont>
        <Lead>
          {[
            '앞 표의 비중을 여섯 축의 모양으로 바꾼 것입니다. 왼쪽이 사전, 오른쪽이 사후이며, 각 축은 그 유형이 차지하는 비중입니다.',
            '인원이 아니라 비중으로 그립니다. 사전 응시자와 사후 응답자의 수가 달라, 인원으로 그리면 유형이 옮겨 간 것인지 사람이 덜 응답한 것인지 가릴 수 없습니다.',
            '모양이 한쪽으로 쏠렸다가 고르게 퍼졌다면 구성원의 특성이 다양해진 것이고, 특정 축이 커졌다면 교육이 그 방향으로 사람들을 옮겼다는 뜻입니다.',
          ]}
        </Lead>

        <Block>
          <TableCaption>프로필 분포의 모양 변화</TableCaption>
          {/* 축은 정해진 자리에 둔다(PROFILE_RADAR_ORDER). */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <SingleRadar
              axes={radarAxes(r.profile.rows, 'preShare')}
              max={radarMax(r.profile.rows)}
              caption={`사전 ${r.coverage.preN}명`}
            />
            <span aria-hidden="true" className="txt-t3 text-gray-500">
              →
            </span>
            <SingleRadar
              axes={radarAxes(r.profile.rows, 'postShare')}
              max={radarMax(r.profile.rows)}
              caption={`사후 ${r.coverage.postN}명`}
            />
          </div>
        </Block>

        <TestLine
          label="분포가 달라졌는가 (χ² 독립성 검정)"
          result={r.profile.chi2}
          extra={
            r.profile.chi2.usable
              ? `χ²(${r.profile.chi2.df}) = ${r.profile.chi2.chi2}, Cramér's V = ${r.profile.chi2.v}`
              : undefined
          }
        />

        {/* 분포가 어떻게 달라졌는지까지는 이 지면에서 마무리한다. */}
        <Insight insight={{ paragraphs: profileIns.paragraphs.slice(0, 2) }} />
      </Chapter>

      <Chapter no="10" title="프로필 변화 분석" cont>
        <Block
          title="같은 사람의 유형 이동"
          description={`이름이 이어진 ${r.coverage.matchedN}명 중 ${r.profile.moved}명의 유형이 바뀌고 ${r.profile.stayed}명이 그대로입니다.`}
        >
          {r.profile.moves.length === 0 ? (
            <EmptyState message="이어진 사람이 없어 이동을 볼 수 없습니다." />
          ) : (
            <Table
              columns={['사전 유형', '사후 유형', '인원']}
              minWidth={560}
              columnWidths={[null, null, 90]}
            >
              {r.profile.moves.map((m) => (
                <tr
                  key={`${m.from}-${m.to}`}
                  className={cn(ROW_CLASS, DESIRED_PROFILES.includes(m.to) && 'bg-green-0')}
                >
                  <Td className="text-gray-500">{profileName(r, m.from)}</Td>
                  <Td className="txt-c1-bold">{profileName(r, m.to)}</Td>
                  <Td className="tabular-nums">{m.n}명</Td>
                </tr>
              ))}
            </Table>
          )}
          <TableNote>바탕이 깔린 줄은 사후 유형이 균형형·실행형·판단형인 경우입니다</TableNote>
        </Block>

        {/* 의도한 방향으로 움직였는지와 그에 따른 권고는 이 장의 결론이다. */}
        <Insight insight={{ paragraphs: profileIns.paragraphs.slice(2) }} />
      </Chapter>

      {/* ── 11 경영진이 본 성숙도 ────────────────────────── */}
      {org.executives > 0 && (
        <Chapter
          no="11"
          title="경영진이 본 AX 성숙도"
          description="임원이 응답한 조직 성숙도입니다. 구성원 역량과는 대상도 문항도 다르므로 같은 축에 놓고 비교하지 않습니다."
        >
          <div className="grid gap-4 lg:grid-cols-3 print:grid-cols-3">
            <Figure
              label="현재 성숙도"
              value={score(org.maturityCurrent)}
              unit="점"
              sub={stageOf(org.maturityCurrent) ?? '—'}
            />
            <Figure
              label="목표 성숙도"
              value={score(org.maturityTarget)}
              unit="점"
              sub={stageOf(org.maturityTarget) ?? '—'}
            />
            <Figure label="임원 응답" value={org.executives} unit="명" />
          </div>

          {org.executives < MIN_GROUP_SIZE && (
            <Caveat>
              임원 응답이 {org.executives}명입니다. 평균이라 해도 개인의 답이 그대로 드러날 수
              있으니, 기업에 전달할 때 이 장을 실을지 판단해 주세요.
            </Caveat>
          )}

          <Block title="관점별 현재와 목표">
            <div className="mb-6">
              <QuadrantWithLegend
                points={r.pre.maturity.competencies.map((c) => ({
                  // 이름이 길어 점 옆에 다 못 적는다. 괄호 앞까지만 쓴다.
                  label: c.name.split('(')[0].trim(),
                  x: c.current,
                  y: c.target,
                }))}
              />
            </div>

            <Table
              columns={['관점', '현재', '목표', '격차']}
              minWidth={600}
              columnWidths={[null, 80, 80, 80]}
            >
              {r.pre.maturity.competencies.map((c) => {
                const gap = c.current === null || c.target === null ? null : c.target - c.current;
                return (
                  <tr key={c.code} className={ROW_CLASS}>
                    <Td className="txt-c1-bold">{c.name}</Td>
                    <Td className="text-gray-500 tabular-nums">{score(c.current)}</Td>
                    <Td className="txt-c1-bold tabular-nums">{score(c.target)}</Td>
                    <Td className="txt-c1-bold tabular-nums">{delta(gap)}</Td>
                  </tr>
                );
              })}
            </Table>
          </Block>
        </Chapter>
      )}

      {/* ── 12 다음 단계 제안 ────────────────────────────── */}
      <Chapter
        no="12"
        title="다음 단계 제안"
        description="이번 결과를 근거로 다음에 이어서 들을 만한 과정을 고릅니다. 무엇을 보고 골랐는지 함께 적었습니다 — 맞지 않는다고 판단되면 그 근거를 짚어 바꾸시면 됩니다."
      >
        {picks.length === 0 ? (
          <Block>
            <EmptyState message="추천할 과정을 고를 만한 자료가 아직 없습니다." />
          </Block>
        ) : (
          picks
            .slice(0, 2)
            .map((rec, i) => <RecommendationCard key={rec.course.no} rec={rec} rank={i + 1} />)
        )}
      </Chapter>

      <Chapter no="12" title="다음 단계 제안" cont>
        {picks.slice(2).map((rec, i) => (
          <RecommendationCard key={rec.course.no} rec={rec} rank={i + 3} />
        ))}

        {/* 세 갈래를 칸으로 나누지 않고 줄로 세운다. 갈래 이름을 왼쪽에 고정하고 내용을 오른쪽으로 편다. */}
        <Block title="종합 제언">
          <div className="divide-adm-line-soft divide-y">
            {[
              {
                label: '주요 강점',
                lines: summary.strengths.slice(0, CONCLUSION_LINES),
                tone: 'bg-green-0 text-green-700',
              },
              {
                label: '보완 필요',
                lines: summary.gaps.slice(0, CONCLUSION_LINES),
                tone: 'bg-special-pink-0 text-special-pink-600',
              },
              {
                label: '실행 제안',
                lines: summary.actions.slice(0, CONCLUSION_LINES),
                tone: 'bg-special-blue-100 text-adm-brand',
              },
            ].map((row) => (
              <div key={row.label} className="flex gap-4 py-2 first:pt-0 last:pb-0">
                <span
                  className={cn('txt-c2-bold h-fit shrink-0 rounded-full px-2.5 py-1', row.tone)}
                >
                  {row.label}
                </span>
                {row.lines.length === 0 ? (
                  <p className="txt-c1-regular text-gray-500">말할 만한 근거가 아직 없습니다.</p>
                ) : (
                  <ul className="flex-1 space-y-1.5">
                    {row.lines.map((line) => (
                      <li key={line} className="txt-c1-regular text-gray-500">
                        · {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Block>
      </Chapter>
    </div>
  );
}

/** 추천 과정 한 장. 지면을 나눠 싣기 때문에 한 곳에 모은다. */
function RecommendationCard({ rec, rank }: { rec: Recommendation; rank: number }) {
  return (
    <Block>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="txt-c2-bold bg-special-blue-100 text-adm-brand rounded-full px-2.5 py-0.5">
          {rank}순위
        </span>
        <span className="txt-c2-bold bg-adm-track-fill rounded-full px-2.5 py-0.5 text-gray-500">
          {rec.course.family}
        </span>
        <span className="txt-c2-regular text-gray-500 tabular-nums">
          {rec.course.hours}시간 · {rec.course.days}일 ·{' '}
          {rec.course.online ? '비대면 가능' : '대면'}
        </span>
        {/* 대상은 과정의 사양이지 권고의 근거가 아니다. 시간·일수와 같은 줄에 둔다. */}
        <span className="txt-c2-regular text-gray-500">대상 {rec.course.audience}</span>
      </div>

      <h3 className="txt-st2-bold mt-3 text-gray-900">{rec.course.shortTitle}</h3>
      <p className="txt-c1-regular mt-1.5 text-gray-500">{rec.course.summary}</p>

      {/* 근거를 먼저, 기대 효과를 그 아래에 둔다 — 읽는 순서가 곧 논리 순서다. */}
      <div className="mt-3.5 space-y-2">
        <div className="bg-gray-0 rounded-[16px] px-5 py-3">
          <p className="txt-c2-bold text-gray-500">이 기업에 권하는 이유</p>
          <ol className="mt-2 grid gap-x-5 gap-y-1.5 lg:grid-cols-2 print:grid-cols-2">
            {rec.reasons.map((reason, i) => (
              <li key={reason} className="flex items-start gap-2">
                <span className="txt-c2-bold bg-special-blue-100 text-adm-brand mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full tabular-nums">
                  {i + 1}
                </span>
                <span className="txt-c1-regular text-gray-500">{reason}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 기대 효과는 이 카드의 결론이라 테두리를 둘러 구분한다. */}
        <div className="border-special-blue-300 bg-special-blue-0 rounded-[16px] border px-5 py-3">
          <p className="txt-c2-bold text-adm-brand">기대 효과</p>
          <p className="txt-c1-regular mt-1.5 text-gray-700">{rec.effect}</p>
        </div>
      </div>
    </Block>
  );
}

/** 회차 표. 지면을 나눠 싣기 때문에 한 곳에 모은다. */
function CourseTable({ courses }: { courses: CompanyReport['satisfaction']['courses'] }) {
  return (
    <Table
      columns={['과정', '기간', '구분', '수강', '만족도 응답']}
      minWidth={640}
      columnWidths={[null, 110, 70, 56, 84]}
    >
      {courses.map((c) => (
        <tr key={c.offeringId} className={ROW_CLASS}>
          <Td className="text-gray-900">{c.title}</Td>
          <Td className="text-gray-500 tabular-nums">
            {c.startDate ?? '—'}
            <br />~ {c.endDate ?? '—'}
          </Td>
          <Td className="txt-c2-regular text-gray-500">{c.role}</Td>
          <Td className="tabular-nums">{c.enrolled}명</Td>
          <Td className="text-gray-500 tabular-nums">
            {c.respondents}명
            {c.mean !== null && <span className="txt-c1-bold ml-1.5 text-gray-900">{c.mean}</span>}
          </Td>
        </tr>
      ))}
    </Table>
  );
}

/** 과정 한 건의 내용. 소개 글과 커리큘럼 모듈을 SafariOn 에 적힌 그대로 옮긴다. */
function CourseDetail({ course }: { course: CourseOverview }) {
  const period =
    course.startDate === null
      ? '기간 미정'
      : `${course.startDate}${course.endDate ? ` ~ ${course.endDate}` : ''}`;

  return (
    <>
      <Block title={course.title}>
        {/* 과정 사실은 곁들이는 수라 한 단계 작게 둔다. */}
        <div className="grid grid-cols-4 gap-2.5">
          <Figure label="교육 방식" value={educationTypeName(course.educationType)} size="sm" />
          {/* 기간은 일수 밑에 붙인다. 며칠짜리인지와 언제였는지는 같은 이야기다. */}
          <Figure
            label="교육 일수"
            value={course.trainingDays ?? '—'}
            unit={course.trainingDays === null ? undefined : '일'}
            sub={period}
            size="sm"
          />
          <Figure
            label="교육 시간"
            value={course.trainingHours ?? '—'}
            unit={course.trainingHours === null ? undefined : '시간'}
            size="sm"
          />
          <Figure label="분야" value={course.categoryName ?? '—'} size="sm" />
        </div>

        {course.description && (
          <p className="txt-c1-regular mt-3.5 text-gray-700">{course.description}</p>
        )}
        {course.goal && course.goal !== course.description && (
          <p className="txt-c1-regular mt-2 text-gray-500">{course.goal}</p>
        )}

        {/* 운영 일정은 따로 카드를 두지 않고 과정 개요 안에 들인다. */}
        {course.lessons.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-2">
            {course.lessons.map((l, i) => (
              <span
                key={`${l.date}-${i}`}
                className="txt-c2-bold bg-gray-0 rounded-full px-3 py-1.5 text-gray-500 tabular-nums"
              >
                {i + 1}일차 {l.date}
                {l.start && l.end ? ` ${l.start}~${l.end}` : ''}
              </span>
            ))}
          </div>
        )}
      </Block>

      {course.modules.length > 0 && (
        <Block title="커리큘럼" description={`${course.modules.length}개 모듈 · 진행 순서`}>
          {/* 두 단으로 세운다. 여덟 모듈을 한 줄씩 내리면 지면을 넘긴다. */}
          <ol className="grid grid-cols-2 gap-x-5 gap-y-1.5">
            {course.modules.map((m, i) => (
              <li key={`${m}-${i}`} className="flex items-start gap-2.5">
                <span className="txt-c2-bold bg-special-blue-100 text-adm-brand mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full tabular-nums">
                  {i + 1}
                </span>
                <span className="txt-c1-regular text-gray-900">{m}</span>
              </li>
            ))}
          </ol>
        </Block>
      )}
    </>
  );
}

/** 객관식 한 문항. 많이 고른 선택지부터 막대로 편다. */
function ChoiceBars({ question }: { question: ChoiceQuestion }) {
  return (
    <ul className="space-y-2.5">
      {question.options.map((o) => (
        <li key={o.order}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="txt-c1-regular text-gray-900">{o.text}</span>
            <span className="txt-c2-bold shrink-0 text-gray-500 tabular-nums">
              {o.count}명 · {o.share}%
            </span>
          </div>
          <span className="bg-adm-track-fill mt-1 block h-1.5 rounded-full">
            <span
              className="block h-1.5 rounded-full"
              style={{
                width: `${o.share}%`,
                background: o.count === 0 ? 'transparent' : CHART_COLORS.POST,
              }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * 서술형 한 문항. 내용이 있는 응답을 골라 그대로 싣고, 걸러 낸 것은 건수로만 남긴다
 * — 무엇이 빠졌는지 읽는 사람이 알아야 한다.
 */
function FreeTextBlock({ question }: { question: FreeTextQuestion }) {
  const meaningful = question.answers.filter(
    (a) => a.valid !== false && a.text.length >= MEANINGFUL_LENGTH,
  );
  // 셋까지. 세 문항을 한 지면에 놓으려면 이만큼이 한계다.
  const shown = [...meaningful].sort((a, b) => b.text.length - a.text.length).slice(0, 3);
  /** 내용은 있지만 지면이 모자라 싣지 못한 것. */
  const held = meaningful.length - shown.length;
  /** 애초에 문장으로 옮길 내용이 없던 것. */
  const dropped = question.answers.length - meaningful.length;

  return (
    <Block
      title={question.content}
      description={`응답 ${question.answers.length}건 · 내용이 있는 ${meaningful.length}건 가운데 ${shown.length}건`}
    >
      {shown.length === 0 ? (
        <EmptyState message="문장으로 옮길 만한 응답이 없습니다." />
      ) : (
        <ul className="space-y-2">
          {shown.map((a, i) => (
            <li key={i} className="bg-gray-0 rounded-[16px] border border-gray-100 px-4 py-1.5">
              <p className="txt-c1-regular text-gray-700">{a.text}</p>
            </li>
          ))}
        </ul>
      )}
      {(held > 0 || dropped > 0) && (
        <TableNote>
          {held > 0 && `내용이 있는 ${held}건은 지면 사정으로 싣지 않았습니다. `}
          {dropped > 0 && `${dropped}건은 "없습니다" 같은 짧은 응답입니다.`}
        </TableNote>
      )}
    </Block>
  );
}

/** 등급 분포 한 덩어리. 종합과 역량 넷이 같은 모양이라 한 곳에 모은다. */
function LevelBlock({ l }: { l: CompanyReport['levels'][number] }) {
  const share = (d: Record<string, number>, n: number, name: string) =>
    n === 0 ? 0 : Math.round((d[name] / n) * 1000) / 10;

  return (
    <Block
      title={l.name === '종합' ? '종합 등급' : `${l.name} 역량`}
      description={
        l.preMode || l.postMode ? `대표 등급 ${l.preMode ?? '—'} → ${l.postMode ?? '—'}` : undefined
      }
    >
      <StackedShare
        rows={[
          {
            label: `사전 ${l.preN}명`,
            values: LEVEL_NAMES.map((name) => share(l.pre, l.preN, name)),
          },
          {
            label: `사후 ${l.postN}명`,
            values: LEVEL_NAMES.map((name) => share(l.post, l.postN, name)),
          },
        ]}
        segments={LEVEL_NAMES.map((name, i) => ({ label: name, color: LEVEL_COLORS[i] }))}
      />

      {/* 띠 위에 인원을 한 줄로 적는다. 표를 따로 두면 같은 수를 두 번 싣게 된다. */}
      <p className="txt-c2-regular mt-3 text-gray-500">
        {LEVEL_NAMES.map((name) => `${name} ${l.pre[name]}→${l.post[name]}명`).join(' · ')}
      </p>
    </Block>
  );
}

/** 정해진 순서대로 축을 세운다. 목록에 없는 유형은 뒤에 붙인다. */
function radarAxes(
  rows: CompanyReport['profile']['rows'],
  key: 'preShare' | 'postShare',
): { label: string; value: number }[] {
  const rank = (id: string) => {
    const i = PROFILE_RADAR_ORDER.indexOf(id);
    return i === -1 ? PROFILE_RADAR_ORDER.length : i;
  };
  return [...rows]
    .sort((a, b) => rank(a.id) - rank(b.id))
    .map((x) => ({ label: x.name, value: x[key] }));
}

/** 사전과 사후가 같은 눈금을 쓰게 한다. 다르면 모양을 견줄 수 없다. */
function radarMax(rows: CompanyReport['profile']['rows']): number {
  return Math.max(40, ...rows.map((x) => Math.max(x.preShare, x.postShare)));
}

/** p 값을 문장 안에 넣는 표기. "p = < .001" 처럼 등호와 부등호를 겹쳐 쓰지 않는다. */
function pPhrase(p: number | null): string {
  if (p === null) return 'p —';
  return p < 0.001 ? `p ${pText(p)}` : `p = ${pText(p)}`;
}

/** 설문 지표 코드를 사람이 읽는 이름으로. 분류가 없는 문항도 있다. */
function metricLabel(code: string | null): string {
  if (code === null) return '—';
  return METRICS.find((m) => m.code === code)?.label ?? code;
}

/** 목록을 n 개씩 끊는다. */
function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function diffColor(v: number | null): string {
  if (v === null || v === 0) return 'text-gray-500';
  return v > 0 ? 'text-green-700' : 'text-special-pink-600';
}

/** 가장 크게 움직인 역량 두 가지. 부호에 따라 말을 바꾼다. */
function extremes(competencies: { short: string; diff: number | null }[]): [string, string][] {
  const withDiff = competencies.filter((c) => c.diff !== null);
  if (withDiff.length === 0) {
    return [['역량 변화', '비교할 사전 기록이 없습니다']];
  }
  const sorted = [...withDiff].sort((a, b) => b.diff! - a.diff!);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  return [
    [
      top.diff! >= 0 ? '가장 많이 오른 역량' : '가장 덜 내린 역량',
      `${top.short} (${delta(top.diff)}점)`,
    ],
    [
      bottom.diff! <= 0 ? '가장 많이 내린 역량' : '가장 덜 오른 역량',
      `${bottom.short} (${delta(bottom.diff)}점)`,
    ],
  ];
}

function profileName(r: CompanyReport, id: string): string {
  return r.profile.rows.find((p) => p.id === id)?.name ?? id;
}
