import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-special-dark-blue-900 relative px-[30px] py-[75px]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-[50px]">
        <div>
          <div className="txt-c1-regular mb-[30px] flex items-center gap-[20px] text-white lg:gap-[30px]">
            <Link href="/terms" className="underline">
              이용약관
            </Link>
            <div>|</div>
            <Link href="/privacy" className="underline">
              개인정보처리방침
            </Link>
          </div>
          <div className="txt-b-bold text-white">(주)헬로월드랩스</div>
          <div className="txt-b-regular text-special-dark-blue-200">
            <p className="leading-[180%]">대표 | 김진호</p>
            <p className="leading-[180%]">문의 | MAIL: contact@helloworldlabs.kr</p>
            <p className="leading-[180%]">전화 | 070-8833-7771</p>
            <p className="leading-[180%]">
              경기도 안양시 동안구 학의로 282 (관양동) 금강펜테리움 IT타워 A동 708호
            </p>
          </div>
        </div>
        <div className="h-[30px] w-[234px] lg:h-[36px] lg:w-[281px]">
          <Image src="/images/logo/img_logo_footer.png" alt="logo" width={281} height={36} />
        </div>
      </div>
    </footer>
  );
}
