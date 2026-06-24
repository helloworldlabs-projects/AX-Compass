'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Section from '@/components/layout/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

const IMAGES = [
  '/images/main/img_banner_1.png',
  '/images/main/img_banner_2.png',
  '/images/main/img_banner_3.png',
  '/images/main/img_banner_4.png',
  '/images/main/img_banner_5.png',
];

const TOTAL = IMAGES.length;

function getOffset(index: number, active: number): number {
  let offset = index - active;
  // 무한 순환을 위해 최단 경로 계산
  if (offset > Math.floor(TOTAL / 2)) offset -= TOTAL;
  if (offset < -Math.floor(TOTAL / 2)) offset += TOTAL;
  return offset;
}

function getCardStyle(offset: number): React.CSSProperties {
  if (offset === 0) {
    return {
      transform: 'translateX(-50%) translateY(-50%) scale(1.05) rotate(0deg)',
      zIndex: 50,
      opacity: 1,
      pointerEvents: 'auto',
    };
  }
  if (offset === -1) {
    return {
      transform: 'translateX(calc(-50% - 320px)) translateY(-50%) scale(0.95) rotate(-3deg)',
      zIndex: 12,
      opacity: 0.8,
      pointerEvents: 'auto',
    };
  }
  if (offset === -2) {
    return {
      transform: 'translateX(calc(-50% - 610px)) translateY(-50%) scale(0.82) rotate(-3deg)',
      zIndex: 11,
      opacity: 0.6,
      pointerEvents: 'auto',
    };
  }
  if (offset === 1) {
    return {
      transform: 'translateX(calc(-50% + 320px)) translateY(-50%) scale(0.95) rotate(3deg)',
      zIndex: 12,
      opacity: 0.8,
      pointerEvents: 'auto',
    };
  }
  if (offset === 2) {
    return {
      transform: 'translateX(calc(-50% + 610px)) translateY(-50%) scale(0.82) rotate(3deg)',
      zIndex: 11,
      opacity: 0.6,
      pointerEvents: 'auto',
    };
  }
  return {
    transform: 'translateX(-50%) translateY(-50%) scale(0.7)',
    zIndex: 11,
    opacity: 0,
    pointerEvents: 'none',
  };
}

export function ResultReportSection() {
  const [active, setActive] = useState(0);

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % TOTAL);
  }, []);

  const goPrev = useCallback(() => {
    setActive((prev) => (prev - 1 + TOTAL) % TOTAL);
  }, []);

  const goTo = useCallback((index: number) => {
    setActive(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 3000);
    return () => clearInterval(timer);
  }, [goNext]);

  const handleArrowNext = useCallback(() => {
    goNext();
  }, [goNext]);

  const handleArrowPrev = useCallback(() => {
    goPrev();
  }, [goPrev]);

  return (
    <Section>
      <SectionHeader
        title={
          <>
            AX Compass <span className="text-purple-700">결과 리포트</span> 예시
          </>
        }
        description={`검사가 완료되면 기관의 AX 성숙도와 구성원 역량을 종합적으로 분석한 결과 리포트를 제공합니다.\n주요 분석 결과와 개선 방향을 한눈에 확인해 보세요.`}
        as="h1"
      />

      {/* 캐러셀 컨테이너 */}
      <div className="relative isolate h-[520px] w-full overflow-hidden">
        {/* 카드들 */}
        {IMAGES.map((src, index) => {
          const offset = getOffset(index, active);
          const cardStyle = getCardStyle(offset);
          const isActive = offset === 0;
          const isClickable = offset !== 0 && Math.abs(offset) <= 2;

          return (
            <div
              key={src}
              className="absolute top-1/2 left-1/2"
              style={{
                ...cardStyle,
                transition: 'transform 400ms ease, opacity 400ms ease',
              }}
              onClick={isClickable ? () => goTo(index) : undefined}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-label={isClickable ? `결과 리포트 ${index + 1}번 이미지로 이동` : undefined}
              onKeyDown={
                isClickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        goTo(index);
                      }
                    }
                  : undefined
              }
            >
              <Image
                src={src}
                alt={`AX Compass 결과 리포트 예시 ${index + 1}`}
                width={300}
                height={424}
                className="rounded-[12px] object-cover shadow"
                draggable={false}
                priority={isActive}
              />
            </div>
          );
        })}

        {/* 좌측 화살표 */}
        <button
          onClick={handleArrowPrev}
          className="absolute top-1/2 z-[51] flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow transition-opacity duration-200 hover:opacity-80"
          style={{ left: 'calc(50% - 190px)' }}
          aria-label="이전 리포트 이미지"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* 우측 화살표 */}
        <button
          onClick={handleArrowNext}
          className="absolute top-1/2 z-[51] flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow transition-opacity duration-200 hover:opacity-80"
          style={{ right: 'calc(50% - 190px)' }}
          aria-label="다음 리포트 이미지"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Dot indicator */}
      <div className="flex items-center gap-4" role="tablist" aria-label="리포트 이미지 선택">
        {IMAGES.map((_, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index === active}
            aria-label={`결과 리포트 ${index + 1}번 이미지`}
            onClick={() => goTo(index)}
            className="h-2.5 w-2.5 cursor-pointer rounded-full transition-colors duration-200"
            style={{
              backgroundColor:
                index === active ? 'var(--color-purple-700)' : 'var(--color-gray-200)',
            }}
          />
        ))}
      </div>

      {/* 하단 설명 텍스트 */}
      <div className="border-special-navy-100 flex items-center justify-center gap-2 rounded-[20px] border bg-white px-4 py-2">
        <div className="flex size-7 items-center justify-center rounded-full bg-purple-700">
          <Check className="size-[21px] shrink-0 text-white" aria-hidden="true" strokeWidth={3} />
        </div>
        <p className="txt-b-regular text-center text-black">
          결과지에는{' '}
          <span className="text-purple-700">
            AX 성숙도 분석, AX 역량 분석, 다면 평가, 프로필 유형 분석, 종합 제언
          </span>{' '}
          등이 포함됩니다.
        </p>
      </div>
    </Section>
  );
}
