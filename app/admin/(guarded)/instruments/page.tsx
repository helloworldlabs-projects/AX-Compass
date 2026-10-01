'use client';

import { PreviewButton } from '@/components/admin/instruments/PreviewButton';
import { Badge, Card, PageHeader, ROW_CLASS, StatCard, Table, Td } from '@/components/admin/ui';
import {
  CAPS,
  COMPETENCIES,
  COMPONENTS,
  EXAM_ITEMS,
  LEVELS,
  LIKERT_MAP,
  PROFILES,
  PROFILE_GROUPS,
  PROFILE_GROUP_MAP,
  SPEC_META,
  SUB_COMPETENCIES,
  optionScoresOf,
  subCompetencyOf,
} from '@/lib/admin/instrument';
import { cn } from '@/lib/utils';

/**
 * 검사 문항 — 조회 전용.
 * 문항의 원본은 설계 스프레드시트다. 수정은 시트에서 하고, 뽑아낸 JSON
 * (lib/admin/data/instrument-post.json)을 커밋으로 반영한다.
 */

const SECTIONS = ['A', 'B', 'C'] as const;

const SECTION_LABEL: Record<string, string> = {
  A: '자기평가',
  B: '상황판단',
  C: '행동빈도',
};

const TYPE_LABEL: Record<string, string> = {
  LIKERT: '별점',
  LIKERT_FREQ: '별점(빈도)',
  SJT: '상황판단',
};

const groupOf = new Map(PROFILE_GROUP_MAP.map((p) => [p.profile, p.group]));
const groupName = new Map(PROFILE_GROUPS.map((g) => [g.id, g.name]));
const countOf = (section: string) => EXAM_ITEMS.filter((i) => i.section === section).length;

export default function InstrumentsPage() {
  return (
    <>
      <PageHeader
        title="검사 문항"
        description="사후검사에 쓰이는 문항과 채점 기준입니다. 수정은 설계 시트에서 하고 다시 불러옵니다."
        action={
          <div className="flex items-center gap-3">
            <Badge tone="info">조회 전용</Badge>
            {/* 응시자와 같은 화면으로 직접 풀어본다. 미리보기 응답은 저장되지 않는다. */}
            <PreviewButton />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <StatCard label="문항" sub="사후검사 전체" value={EXAM_ITEMS.length} unit="개" />
        <StatCard label="핵심 역량" sub="U · P · E · R" value={COMPETENCIES.length} unit="개" />
        <StatCard
          label="세부 역량"
          sub="문항이 연결되는 단위"
          value={SUB_COMPETENCIES.length}
          unit="개"
        />
        <StatCard label="반영일" sub={SPEC_META.source} value={SPEC_META.parsedAt} />
      </div>

      {SECTIONS.map((section) => {
        const items = EXAM_ITEMS.filter((i) => i.section === section);
        return (
          <Card
            key={section}
            title={`${section}. ${SECTION_LABEL[section]}`}
            description={`${items.length}개 문항`}
            padded={false}
          >
            <Table minWidth={900} columns={['번호', '세부 역량', '문항', '유형', '척도']}>
              {items.map((item) => {
                const sub = subCompetencyOf(item.tag);
                const scores = item.type === 'SJT' ? optionScoresOf(item.id) : [];

                return (
                  <tr key={item.id} className={ROW_CLASS}>
                    <Td className="txt-c2-regular whitespace-nowrap text-gray-500 tabular-nums">
                      {item.id}
                    </Td>
                    <Td className="whitespace-nowrap">
                      <span className="txt-c2-bold bg-adm-line-soft rounded-full px-2.5 py-1 text-gray-700">
                        {sub?.name ?? item.tag}
                      </span>
                    </Td>
                    <Td className="w-full text-gray-700">
                      {item.prompt}

                      {scores.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {item.options.map((o) => {
                            const s = scores.find((x) => x.code === o.code);
                            const best = s?.score === 100;
                            return (
                              <li key={o.code} className="flex items-start gap-3">
                                <span
                                  className={cn(
                                    'txt-c2-bold w-[68px] shrink-0 rounded-[6px] px-2 py-0.5 text-center whitespace-nowrap tabular-nums',
                                    best
                                      ? 'bg-special-blue-100 text-adm-brand'
                                      : 'bg-gray-0 text-gray-500',
                                  )}
                                >
                                  {o.code} · {s?.score ?? '—'}
                                </span>
                                <span className="txt-c2-regular text-gray-500">{o.text}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </Td>
                    <Td className="txt-c2-regular whitespace-nowrap text-gray-500">
                      {TYPE_LABEL[item.type] ?? item.type}
                    </Td>
                    <Td className="txt-c2-regular whitespace-nowrap text-gray-500 tabular-nums">
                      {item.type === 'SJT' ? '0~100' : `${item.scaleMin}~${item.scaleMax}`}
                    </Td>
                  </tr>
                );
              })}
            </Table>
          </Card>
        );
      })}

      <Card
        title="세부 역량"
        description="문항은 반드시 하나의 세부 역량에 연결됩니다."
        padded={false}
      >
        <Table minWidth={900} columns={['태그', '역량', '세부 역량', '정의', '문항']}>
          {SUB_COMPETENCIES.map((s) => (
            <tr key={s.tag} className={ROW_CLASS}>
              <Td className="txt-c2-bold text-gray-500">{s.tag}</Td>
              <Td className="whitespace-nowrap text-gray-500">{s.parent}</Td>
              <Td className="txt-c1-bold whitespace-nowrap text-gray-900">{s.name}</Td>
              <Td className="txt-c2-regular w-full text-gray-500">{s.definition}</Td>
              <Td className="whitespace-nowrap text-gray-500 tabular-nums">
                {EXAM_ITEMS.filter((i) => i.tag === s.tag).length}개
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* 채점 기준과 판정 규칙 — 문항을 본 다음에 확인하는 것들 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="구성요소 가중치"
          description="자기 인식보다 실제 판단을 크게 봅니다."
          padded={false}
        >
          <Table minWidth={0} columns={['구성요소', '문항', '비중']}>
            {COMPONENTS.map((c) => (
              <tr key={c.section} className={ROW_CLASS}>
                <Td className="txt-c1-bold">
                  {c.section}. {c.name}
                </Td>
                <Td className="text-gray-500 tabular-nums">{countOf(c.section)}개</Td>
                <Td className="txt-c1-bold text-gray-900 tabular-nums">
                  {Math.round(c.weight * 100)}%
                </Td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card title="역량 가중치" description="실무 적용과 검증·개선을 크게 봅니다." padded={false}>
          <Table minWidth={0} columns={['역량', '비중']}>
            {COMPETENCIES.map((c) => (
              <tr key={c.id} className={ROW_CLASS}>
                <Td className="txt-c1-bold">
                  {c.id}. {c.name}
                </Td>
                <Td className="txt-c1-bold text-gray-900 tabular-nums">
                  {Math.round(c.weight * 100)}%
                </Td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card title="점수 환산" description="1~5점 응답을 0~100으로 바꿉니다." padded={false}>
          <Table minWidth={0} columns={['응답', '환산 점수']}>
            {LIKERT_MAP.map((m) => (
              <tr key={m.likert} className={ROW_CLASS}>
                <Td className="txt-c1-bold">{m.likert}점</Td>
                <Td className="txt-c1-bold text-gray-900 tabular-nums">{m.score}</Td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card title="등급 구간" description="종합 점수를 등급으로 나눕니다." padded={false}>
          <Table minWidth={0} columns={['등급', '구간']}>
            {LEVELS.map((l) => (
              <tr key={l.level} className={ROW_CLASS}>
                <Td className="txt-c1-bold">{l.level}</Td>
                <Td className="text-gray-500 tabular-nums">
                  {l.min} ~ {l.max}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>

      <Card
        title="등급 상한 제한"
        description="종합 점수가 높아도 평가 · 책임 역량이 낮으면 상위 등급을 주지 않습니다."
        padded={false}
      >
        <Table minWidth={0} columns={['조건', '상한', '이유']}>
          {CAPS.map((c) => (
            <tr key={c.condition} className={ROW_CLASS}>
              <Td className="txt-c1-bold whitespace-nowrap tabular-nums">{c.condition}</Td>
              <Td>
                <Badge tone={c.capLevel === '제한 없음' ? 'neutral' : 'warn'}>{c.capLevel}</Badge>
              </Td>
              <Td className="text-gray-500">{c.note}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card
        title="프로필 유형"
        description="위에서부터 차례로 보고, 먼저 맞는 것으로 확정합니다. 순서가 바뀌면 결과가 달라집니다."
        padded={false}
      >
        <Table minWidth={900} columns={['순서', '유형', '판정 조건', '학습 그룹']}>
          {PROFILES.map((p, i) => (
            <tr key={p.id} className={ROW_CLASS}>
              <Td className="txt-c2-regular text-gray-500 tabular-nums">{i + 1}</Td>
              <Td className="txt-c1-bold whitespace-nowrap text-gray-900">{p.name}</Td>
              <Td className="txt-c2-regular w-full text-gray-500 tabular-nums">{p.condition}</Td>
              <Td className="whitespace-nowrap">
                <Badge tone="neutral">{groupName.get(groupOf.get(p.id) ?? '') ?? '—'}</Badge>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
