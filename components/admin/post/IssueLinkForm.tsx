'use client';

import { useState, type ReactNode } from 'react';

import { AdminDialog } from '@/components/admin/Dialog';
import { Button, FormError, INPUT_CLASS } from '@/components/admin/ui';
import { useIssuePostLink } from '@/hooks/usePostLink';
import { copyText } from '@/lib/admin/copy-text';
import type { IssueCompany, IssueOptions } from '@/lib/admin/issue-options';
import { todayKST } from '@/lib/admin/metrics';
import { notify } from '@/lib/admin/notify';
import { cn } from '@/lib/utils';
import { examUrlOf } from './CopyLinkButton';

/** 기본 마감일. 오늘로부터 일주일 뒤. */
function defaultDueOn() {
  const d = new Date(`${todayKST()}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 7);
  return d.toISOString().slice(0, 10);
}

interface Issued {
  org: string;
  course: string;
  dueOn: string;
  target: number;
  slug: string;
  operator: string;
  offering: string;
}

/**
 * 링크 발급. 운영 기관 → 교육 운영 건 → 학습 기업 순으로 좁힌다.
 *
 * 운영 건에 학습 기업이 연결되어 있으면 그 안에서만 고르고, 하나뿐이면 골라 둔다.
 * 연결이 없으면 사전검사를 치른 기업 가운데 직접 고른다. 한 번 쓴 운영 건도 계속
 * 고를 수 있다 — 한 교육에 여러 기업이 참여했으면 기업마다 따로 발급한다.
 */
export function IssueLinkForm({ options }: { options: IssueOptions }) {
  const issue = useIssuePostLink();

  const [open, setOpen] = useState(false);
  const [operatorId, setOperatorId] = useState<number | null>(null);
  const [offeringId, setOfferingId] = useState<string | null>(null);
  const [institutionId, setInstitutionId] = useState<number | null>(null);
  /** 기업을 직접 고를 때의 검색어. */
  const [query, setQuery] = useState('');
  const [dueOn, setDueOn] = useState(defaultDueOn);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const operator = options.operators.find((o) => o.institutionId === operatorId) ?? null;
  const offering = operator?.offerings.find((o) => o.offeringId === offeringId) ?? null;

  const linked = offering?.companies ?? [];
  const fromLink = linked.length > 0;
  const q = query.trim().toLowerCase();
  const pool: IssueCompany[] = fromLink
    ? linked
    : options.companies.filter(
        (c) => c.name.toLowerCase().includes(q) || (c.code ?? '').toLowerCase().includes(q),
      );

  const company = pool.find((c) => c.institutionId === institutionId) ?? null;
  const canSubmit = offering !== null && company !== null && company.eligible && !issue.isPending;

  function openDialog() {
    setOperatorId(null);
    setOfferingId(null);
    setInstitutionId(null);
    setQuery('');
    setDueOn(defaultDueOn());
    setIssued(null);
    setCopied(false);
    setCopyFailed(false);
    issue.reset();
    setOpen(true);
  }

  function pickOperator(id: number) {
    setOperatorId(id);
    // 기관이 바뀌면 앞서 고른 것들은 뜻이 없다.
    setOfferingId(null);
    setInstitutionId(null);
    setQuery('');
  }

  /** 운영 건을 고르면, 연결된 기업이 하나뿐일 때 그것으로 정해 둔다. */
  function pickOffering(id: string) {
    setOfferingId(id);
    setQuery('');
    const only = operator?.offerings.find((o) => o.offeringId === id)?.companies ?? [];
    setInstitutionId(only.length === 1 ? only[0].institutionId : null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !operator || !offering || !company) return;
    issue.mutate(
      {
        institutionId: company.institutionId,
        // 고른 운영 건의 이름을 손대지 않고 그대로 쓴다 (원본과 같다).
        courseTitle: offering.title.slice(0, 255),
        dueOn,
        offeringIds: [offering.offeringId],
      },
      {
        onSuccess: (link) =>
          setIssued({
            org: link.org,
            course: link.course ?? offering.title,
            dueOn: link.dueOn,
            target: company.preRespondents,
            slug: link.slug,
            operator: operator.name,
            offering: offering.title,
          }),
      },
    );
  }

  async function copy(slug: string) {
    const url = examUrlOf(slug);
    const ok = await copyText(url);
    setCopyFailed(!ok);
    if (!ok) return;
    // 주소가 눈앞에 있으므로 버튼 글자만 바꾼다. 운영체제 알림은 창을 벗어났을 때를 위해 함께 띄운다.
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    void notify('AX Compass', `${url}\n담당자에게 전달해 주세요.`);
  }

  return (
    <>
      <Button size="lg" onClick={openDialog}>
        링크 발급
      </Button>

      <AdminDialog
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={issued ? '링크를 발급했습니다' : '사후검사 링크 발급'}
        description={
          issued
            ? '담당자에게 전달해 주세요. 응시자는 링크를 열고 이름을 적습니다.'
            : '교육을 운영한 기관과 운영 건을 고르고, 그 교육을 받은 기업에 발급합니다.'
        }
      >
        {issued ? (
          <>
            <div className="bg-gray-0 mt-6 rounded-[16px] px-5 py-4">
              <p className="txt-c1-bold text-gray-900">{issued.org}</p>
              <p className="txt-c2-regular mt-1 text-gray-500">
                {issued.operator} · {issued.offering}
              </p>
              <p className="txt-c1-regular mt-2 text-gray-500">
                {issued.course} · 대상 {issued.target}명 · 마감 {issued.dueOn}
              </p>

              <p className="txt-c2-bold mt-4 text-gray-500">응시 링크</p>
              <p className="txt-c1-bold text-adm-brand mt-1 break-all">{examUrlOf(issued.slug)}</p>
            </div>

            {copyFailed && (
              <p role="alert" className="txt-c1-bold text-special-pink-600 mt-4">
                링크를 복사하지 못했습니다. 위 주소를 직접 복사해 주세요.
              </p>
            )}

            <div className="mt-7 flex justify-end gap-2">
              <Button variant="ghost" size="lg" onClick={() => copy(issued.slug)}>
                {copied ? '링크를 복사했습니다' : '링크 복사'}
              </Button>
              <Button size="lg" onClick={() => setOpen(false)}>
                확인
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={submit}>
            <div className="mt-6 space-y-6">
              <Step no="1" label="운영 기관">
                <div className="flex flex-wrap gap-2">
                  {options.operators.map((o) => {
                    const on = o.institutionId === operatorId;
                    return (
                      <button
                        key={o.institutionId}
                        type="button"
                        aria-pressed={on}
                        onClick={() => pickOperator(o.institutionId)}
                        className={cn(
                          'txt-c1-bold rounded-full border px-4 py-2 transition-colors duration-200',
                          on
                            ? 'border-adm-brand bg-adm-brand text-white'
                            : 'hover:bg-adm-line-soft bg-gray-0 border-gray-100 text-gray-900',
                        )}
                      >
                        {o.name}
                        <span
                          className={cn(
                            'txt-c2-regular ml-1.5 tabular-nums',
                            on ? 'text-white/70' : 'text-gray-500',
                          )}
                        >
                          {o.offerings.length}건
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Step>

              {operator && (
                <Step
                  no="2"
                  label="교육 운영 건"
                  hint="이번 사후검사가 다루는 교육입니다. 보고서의 교육 개요와 만족도를 이 건에서 가져옵니다."
                >
                  <ScrollList>
                    {operator.offerings.map((o) => {
                      const on = o.offeringId === offeringId;
                      return (
                        <li key={o.offeringId}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => pickOffering(o.offeringId)}
                            className={cn(
                              'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-200',
                              on ? 'bg-special-blue-100' : 'hover:bg-adm-line-soft',
                            )}
                          >
                            <Dot on={on} />
                            <span className="min-w-0 flex-1">
                              <span className="txt-c1-bold block text-gray-900">
                                {o.title}
                                {o.cohortNumber !== null && (
                                  <span className="txt-c2-regular ml-1.5 text-gray-500">
                                    {o.cohortNumber}기
                                  </span>
                                )}
                              </span>
                              <span className="txt-c2-regular mt-0.5 block text-gray-500">
                                {o.startDate ?? '기간 미정'}
                                {o.endDate ? ` ~ ${o.endDate}` : ''} · 수강 {o.enrolled}명 · 만족도{' '}
                                {o.respondents}명{o.mean !== null && ` · ${o.mean}점`}
                                {o.companies.length > 0 && ` · 학습 기업 ${o.companies.length}곳`}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ScrollList>
                </Step>
              )}

              {offering && (
                <Step
                  no="3"
                  label="학습 기업"
                  hint={
                    fromLink
                      ? '이 교육에 연결된 기업입니다. 링크는 이 기업 앞으로 나갑니다.'
                      : '이 교육에는 학습 기업이 연결되어 있지 않습니다. 사전검사를 치른 기업 가운데 직접 고릅니다.'
                  }
                >
                  {!fromLink && (
                    <input
                      type="search"
                      aria-label="기업 찾기"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="기업명 또는 코드로 찾기"
                      className={cn(INPUT_CLASS, 'mb-2.5 h-11')}
                    />
                  )}

                  {pool.length === 0 ? (
                    <p className="txt-c1-regular bg-gray-0 rounded-[16px] px-5 py-5 text-gray-500">
                      고를 기업이 없습니다.
                    </p>
                  ) : (
                    <ScrollList>
                      {pool.map((c) => {
                        const on = c.institutionId === institutionId;
                        return (
                          <li key={c.institutionId}>
                            <button
                              type="button"
                              aria-pressed={on}
                              disabled={!c.eligible}
                              onClick={() => setInstitutionId(c.institutionId)}
                              className={cn(
                                'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-200',
                                on
                                  ? 'bg-special-blue-100'
                                  : c.eligible
                                    ? 'hover:bg-adm-line-soft'
                                    : 'cursor-not-allowed opacity-60',
                              )}
                            >
                              <Dot on={on} />
                              <span className="min-w-0 flex-1">
                                <span className="txt-c1-bold block text-gray-900">
                                  {c.name}
                                  {c.code && (
                                    <span className="txt-c2-regular ml-2 text-gray-500 tabular-nums">
                                      {c.code}
                                    </span>
                                  )}
                                </span>
                                <span className="txt-c2-regular mt-0.5 block text-gray-500">
                                  사전검사 {c.preRespondents}명{c.reason && ` · ${c.reason}`}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ScrollList>
                  )}
                </Step>
              )}

              {company?.eligible && (
                <>
                  {/* 과정명은 받지 않는다. 2단계의 운영 건이 곧 이 검사가 다루는 교육이다. */}
                  <div>
                    <label htmlFor="link-due" className="txt-c1-bold text-gray-900">
                      마감일
                    </label>
                    <input
                      id="link-due"
                      type="date"
                      value={dueOn}
                      min={todayKST()}
                      onChange={(e) => setDueOn(e.target.value)}
                      className={cn(INPUT_CLASS, 'mt-2')}
                    />
                    <p className="txt-c2-regular mt-1.5 text-gray-500">
                      마감 뒤에는 링크를 열어도 응시할 수 없습니다.
                    </p>
                  </div>

                  <div className="bg-gray-0 rounded-[16px] px-5 py-4">
                    <p className="txt-c1-regular text-gray-500">
                      <b className="text-gray-900">{operator?.name}</b>이(가) 운영한{' '}
                      <b className="text-gray-900">{offering?.title}</b>의 사후검사를{' '}
                      <b className="text-gray-900">{company.name}</b>에 보냅니다. 대상 인원은{' '}
                      <b className="text-gray-900">{company.preRespondents}명</b>으로, 그 기업에서
                      사전검사를 치른 사람 수이자 응답률의 분모입니다.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5">
              <FormError error={issue.error} fallback="링크를 발급하지 못했습니다." />
            </div>

            <div className="mt-7 flex justify-end gap-2">
              <Button variant="ghost" size="lg" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button type="submit" size="lg" disabled={!canSubmit}>
                {issue.isPending ? '발급 중…' : '링크 발급'}
              </Button>
            </div>
          </form>
        )}
      </AdminDialog>
    </>
  );
}

/** 단계 하나. 번호를 붙여 고르는 차례가 있다는 것을 드러낸다. */
function Step({
  no,
  label,
  hint,
  children,
}: {
  no: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="txt-c1-bold flex items-center gap-2 text-gray-900">
        <span className="txt-c2-bold bg-adm-brand flex size-5 items-center justify-center rounded-full text-white">
          {no}
        </span>
        {label}
      </p>
      {hint && <p className="txt-c2-regular mt-1.5 text-gray-500">{hint}</p>}
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

/** 목록이 길어도 창이 늘어나지 않도록 가둔다. */
function ScrollList({ children }: { children: ReactNode }) {
  return (
    <div className="max-h-[240px] overflow-y-auto rounded-[16px] border border-gray-100">
      <ul className="divide-adm-line-soft divide-y">{children}</ul>
    </div>
  );
}

/** 고른 표시. 라디오 버튼 자리다. */
function Dot({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'mt-1 flex size-4 shrink-0 items-center justify-center rounded-full',
        on ? 'bg-adm-brand' : 'bg-gray-200',
      )}
    >
      {on && <span className="size-1.5 rounded-full bg-white" />}
    </span>
  );
}
