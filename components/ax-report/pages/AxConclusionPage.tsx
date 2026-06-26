import { BookUp, NotepadText, ShieldAlert, ShieldCheck } from 'lucide-react';
import {
  getAxInsightContent,
  type AxInsightSection,
} from '../../../types/ax-report';
import Image from 'next/image';

interface AxConclusionPageProps {
  data: AxInsightSection;
}

export function AxConclusionPage({ data }: AxConclusionPageProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">12</div>
        <div className="txt-b-bold">종합 인사이트</div>
        <div className="txt-c2-regular">
          기관 성숙도와 구성원 역량 결과를 종합하여 주요 강점과 보완 과제를
          정리하고, 향후 교육 및 실행 방향을 제안합니다.
        </div>
      </div>
      <div className="border-special-orange-300 flex gap-3 rounded-[12px] border p-3">
        <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
          <NotepadText className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="txt-b-bold text-special-dark-blue-700">종합 제언</div>
          <div className="txt-c2-regular text-special-dark-blue-700">
            {getAxInsightContent(data.insights, 0)}
          </div>
        </div>
      </div>
      <div className="border-special-orange-300 flex gap-3 rounded-[12px] border p-3">
        <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
          <ShieldCheck className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="txt-b-bold text-special-dark-blue-700">주요 강점</div>
          <div className="txt-c2-regular text-special-dark-blue-700">
            {getAxInsightContent(data.insights, 1)}
          </div>
        </div>
      </div>
      <div className="border-special-orange-300 flex gap-3 rounded-[12px] border p-3">
        <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
          <ShieldAlert className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="txt-b-bold text-special-dark-blue-700">보완 필요 영역</div>
          <div className="txt-c2-regular text-special-dark-blue-700">
            {getAxInsightContent(data.insights, 2)}
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="border-special-orange-300 flex flex-1 gap-3 rounded-[12px] border p-3">
          <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
            <BookUp className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="txt-b-bold text-special-dark-blue-700">교육 제안</div>
            <div className="txt-c2-regular text-special-dark-blue-700">
              {getAxInsightContent(data.insights, 3)}
            </div>
          </div>
        </div>
        <div className="relative size-[80px] shrink-0">
          <Image
            src="/images/report/deco_report.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
