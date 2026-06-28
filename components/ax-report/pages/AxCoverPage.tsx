import Image from 'next/image';

interface AxCoverPageProps {
  institutionName: string;
  completedAt: string | null;
}

export function AxCoverPage({
  institutionName,
  completedAt,
}: AxCoverPageProps) {
  const formatDate = (date: string | null) => {
    return date?.split('T')[0]?.replace(/-/g, '.') ?? '0000.00.00';
  };

  return (
    <div className="relative flex min-h-[882px] flex-col items-center justify-center bg-white p-6">
      <Image
        src="/images/report/bg_ax_report.png"
        alt=""
        fill
        className="object-cover"
      />
      <div className="flex flex-col items-center gap-[150px]">
        <div className="flex flex-col gap-[50px]">
          <div className="relative h-[50px] w-[290px]">
            <Image
              src="/images/report/logo_axcompass.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <div className="relative flex flex-col items-center">
            <div className="relative h-[53px] w-[265px]">
              <Image
                src="/images/report/divider.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-special-navy-0 txt-t1 text-center">
                AX 성숙도·역량 검사
                <br />
                결과 보고서
              </div>
              <div className="txt-st-bold text-center text-purple-200">
                {institutionName}
              </div>
            </div>
            <div className="relative h-[53px] w-[265px]">
              <Image
                src="/images/report/divider.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
        <div className="txt-b-regular text-special-navy-0 relative">
          {formatDate(completedAt)}
        </div>
      </div>
    </div>
  );
}
