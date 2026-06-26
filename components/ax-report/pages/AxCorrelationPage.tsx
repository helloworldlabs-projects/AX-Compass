import { NotepadText } from 'lucide-react';
import { AxCorrelationHeatmap } from '../AxCorrelationHeatmap';
import {
  getAxInsightContent,
  type AxTagCorrelationSection,
} from '../../../types/ax-report';

interface AxCorrelationPageProps {
  data: AxTagCorrelationSection;
}

export function AxCorrelationPage({ data }: AxCorrelationPageProps) {
  const top3 = data.topCorrelations ?? [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 text-black">
        <div className="txt-b-bold text-special-navy-500">10</div>
        <div className="txt-b-bold">구성원 AX 역량 - 상관 분석</div>
        <div className="txt-c2-regular">
          세부 역량 간의 연관 경향을 분석하여 함께 나타나는 역량 관계와 교육
          설계 시 연계하여 살펴볼 역량군을 확인합니다.
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="txt-c1-bold text-center">
          AX 역량 하위 역량 간 Spearman 상관
        </div>
        <div className="ml-[-70px] flex justify-center">
          <AxCorrelationHeatmap correlationMatrix={data.correlationMatrix ?? []} />
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-[12px] p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.14)]">
        <div className="txt-c1-bold">주요 상관 관계 TOP 3</div>
        <div className="txt-c2-bold flex flex-col overflow-hidden rounded-[8px]">
          <div className="bg-special-dark-blue-100 flex items-center">
            <div className="w-[130px] min-w-[130px] shrink-0 px-2 py-1.5 text-center">역량 A</div>
            <div className="w-[130px] min-w-[130px] shrink-0 px-2 py-1.5 text-center">역량 B</div>
            <div className="w-[50px] min-w-[50px] shrink-0 px-2 py-1.5 text-center">상관</div>
            <div className="flex-1 px-2 py-1.5 text-center">해석</div>
          </div>
          {top3.map((c, index) => (
            <div
              key={`${c.tagCode1}-${c.tagCode2}`}
              className={`flex items-center ${index % 2 === 0 ? 'bg-special-dark-blue-0' : 'bg-white'}`}
            >
              <div className="txt-c2-regular flex h-[32px] w-[130px] min-w-[130px] shrink-0 items-center px-2 text-center">{c.tagCode1}. {c.tagName1}</div>
              <div className="txt-c2-regular flex h-[32px] w-[130px] min-w-[130px] shrink-0 items-center px-2 text-center">{c.tagCode2}. {c.tagName2}</div>
              <div className="txt-c2-bold flex h-[32px] w-[50px] min-w-[50px] shrink-0 items-center justify-center px-2">{c.correlationCoefficient.toFixed(2)}</div>
              <div className="txt-c2-regular flex h-[32px] flex-1 items-center px-2 text-center">{c.interpretation}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-special-orange-300 flex gap-3 rounded-[12px] border p-3">
        <div className="bg-special-orange-500 flex size-[40px] shrink-0 items-center justify-center rounded-[20px]">
          <NotepadText className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="txt-b-bold text-special-dark-blue-700">인사이트 요약</div>
          <div className="txt-c2-regular text-special-dark-blue-700">{getAxInsightContent(data.insights, 0)}</div>
        </div>
      </div>
    </div>
  );
}
