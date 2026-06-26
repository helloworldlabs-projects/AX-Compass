import Image from 'next/image';

interface AxReportPageLayoutProps {
  institutionLogoUrl: string;
  isLastPage?: boolean;
  children: React.ReactNode;
}

export function AxReportPageLayout({
  institutionLogoUrl,
  isLastPage,
  children,
}: AxReportPageLayoutProps) {
  return (
    <div className="relative flex min-h-[882px] flex-col gap-6 bg-white p-6">
      <div className="border-special-navy-500 flex items-center justify-between border-b pb-1">
        <div className="relative h-[20px] w-[60px]">
          <Image
            src="/images/report/logo_axcompass_black.png"
            alt="AX Compass"
            fill
            className="object-contain object-left"
          />
        </div>
        <div className="relative h-[20px] w-[60px]">
          <Image
            src={institutionLogoUrl}
            alt=""
            fill
            className="object-contain object-right"
          />
        </div>
      </div>
      {children}
      <p className="border-special-navy-500 mt-auto border-t pt-1 text-[8px] text-gray-400">
        Copyright 2026. HelloworldLabs Inc.
      </p>
      {isLastPage && (
        <div className="absolute bottom-[64px] left-0 w-full text-center">
          <div className="txt-c1-bold text-gray-500">
            감사합니다.
            <br />
            AX Compass 성숙도·역량 검사 결과 보고서
          </div>
        </div>
      )}
    </div>
  );
}
