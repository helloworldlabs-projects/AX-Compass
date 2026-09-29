'use client';

import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';

import { ExamFlow, type ExamCohort } from '@/components/after/ExamFlow';
import { ErrorState, LoadingState } from '@/components/admin/ui';
import { usePublicLink } from '@/hooks/usePostLink';
import { useOpsToken } from '@/hooks/useOpsToken';
import { ApiError } from '@/types/common';

// 관리자 미리보기는 실제 고객사 이름을 쓰지 않는다.
// 화면을 보여주다 남의 회사 이름이 섞이면 오해를 산다.
const PREVIEW_COHORT: ExamCohort = {
  org: '헬로월드랩스',
  title: 'AX 역량강화 과정',
  course: '미리보기',
};

/**
 * 사후검사 응시 화면. 기업 단위 공통 링크(/after/{영문명})로 접근한다. 로그인 없음.
 *
 * 화면의 기업 이름(학습 기업 우선, 없으면 운영 기관)은 백엔드가 정해 준다.
 * 마감했거나 마감일이 지난 링크는 열지 않는다 — 기업이 마감한 뒤 들어온 응답이 섞인다.
 *
 * /after/preview 또는 ?preview 는 관리자가 문항을 직접 풀어보는 경로. 응답을 저장하지 않는다.
 * 관리자 토큰이 있을 때만 연다 — 문항이 새면 사전·사후 비교가 흔들린다.
 */
export default function ExamPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const preview = slug === 'preview' || searchParams.has('preview');

  return preview ? <PreviewExam /> : <LinkExam slug={slug} />;
}

function PreviewExam() {
  const token = useOpsToken();

  return (
    <Shell preview={!!token}>
      {token === undefined ? (
        <LoadingState />
      ) : token === null ? (
        <Message title="관리자만 볼 수 있습니다">
          문항 미리보기는 로그인한 관리자에게만 열립니다.
        </Message>
      ) : (
        <ExamFlow slug="preview" cohort={PREVIEW_COHORT} preview />
      )}
    </Shell>
  );
}

function LinkExam({ slug }: { slug: string }) {
  const link = usePublicLink(slug);
  const status = link.error instanceof ApiError ? link.error.status : undefined;

  return (
    <Shell>
      {link.isPending ? (
        <LoadingState />
      ) : link.isError ? (
        status === 404 ? (
          <Message title="링크를 확인해 주세요">
            발급되지 않은 주소입니다. 교육 담당자에게 문의해 주세요.
          </Message>
        ) : status === 410 ? (
          <Message title="마감된 검사입니다">
            종료된 검사입니다. 교육 담당자에게 문의해 주세요.
          </Message>
        ) : (
          <ErrorState error={link.error} onRetry={() => void link.refetch()} />
        )
      ) : link.data.closed ? (
        <Message title="마감된 검사입니다">
          {link.data.dueOn} 에 종료되었습니다. 교육 담당자에게 문의해 주세요.
        </Message>
      ) : (
        <ExamFlow
          slug={slug}
          cohort={{
            org: link.data.org,
            title: link.data.course ?? '사후검사',
            course: '사후검사',
            dueOn: link.data.dueOn,
          }}
        />
      )}
    </Shell>
  );
}

// 호스트 인쇄 CSS 가 <header> 를 숨기므로 div 로 둔다.
function Shell({ preview = false, children }: { preview?: boolean; children: React.ReactNode }) {
  return (
    <div className="bg-gray-0 min-h-screen">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-[68px] w-full max-w-[1000px] items-center px-4 lg:px-6">
          <Image
            src="/images/report/logo_axcompass_black.png"
            alt="AX Compass"
            width={124}
            height={22}
            preload
            className="h-[22px] w-auto"
          />
          <span className="txt-c2-bold bg-adm-track-fill ml-2 rounded-full px-2.5 py-1 text-gray-500">
            사후검사
          </span>
          {preview && (
            <span className="txt-c2-bold bg-special-pink-100 text-special-pink-600 ml-2 rounded-full px-2.5 py-1">
              미리보기 · 저장되지 않음
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function Message({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[560px] px-4 py-24 text-center">
      <h1 className="txt-t3 text-gray-900">{title}</h1>
      <p className="txt-c1-regular mt-3 text-gray-500">{children}</p>
    </div>
  );
}
