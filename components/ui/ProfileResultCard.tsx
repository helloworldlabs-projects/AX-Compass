import { cn } from '@/lib/utils';
import Image from 'next/image';

export type ProfileResultCardProps = {
  /** 타입 한글명 (예: 균형형) */
  typeLabel: string;
  /** 타입 영문명 (예: Balanced) */
  typeEn: string;
  /** 헤더 하단 설명 문단 */
  description: string;
  /** 강점 bullet 목록 */
  strengths: string[];
  /** 보완 방향 bullet 목록 */
  improvements: string[];
  /** 해시태그 문자열 (`#` 있거나 없음) */
  tags: string[];
  imageUrl: string;
  className?: string;
};

/**
 * 프로필 진단 결과 카드. 데이터는 모두 props로 주입합니다.
 */
export function ProfileResultCard({
  typeLabel,
  typeEn,
  description,
  strengths,
  improvements,
  tags,
  imageUrl,
  className,
}: ProfileResultCardProps) {
  return (
    <article className={cn('flex w-full max-w-lg flex-col gap-[50px]', className)}>
      <ResultHero imageUrl={imageUrl} />
      <div className="flex flex-col gap-[30px] rounded-[12px] border border-gray-500 bg-white px-5 py-[50px] lg:px-[50px]">
        <ResultHeader typeLabel={typeLabel} typeEn={typeEn} description={description} />
        <ResultSection sectionId="strengths" title="강점" items={strengths} />
        <ResultSection sectionId="improvements" title="보완 방향" items={improvements} />
        <TagList tags={tags} />
      </div>
    </article>
  );
}

function ResultHero({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="mx-auto h-[250px] w-[250px] lg:h-100 lg:w-100" aria-hidden>
      <Image
        src={imageUrl}
        width={400}
        height={400}
        className="h-full w-full object-contain"
        alt=""
      />
    </div>
  );
}

function ResultHeader({
  typeLabel,
  typeEn,
  description,
}: Pick<ProfileResultCardProps, 'typeLabel' | 'typeEn' | 'description'>) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-1.5 text-black">
        <div className="flex gap-1.5" aria-hidden>
          <span className="txt-t1 text-special-pink-500">* </span>
          <div>
            <span className="txt-t1">{typeLabel}</span>
            <span className="txt-t3">({typeEn})</span>
          </div>
        </div>
      </div>
      <p className="txt-b-regular text-black">{description}</p>
    </div>
  );
}

function ResultSection({
  sectionId,
  title,
  items,
}: {
  sectionId: string;
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;

  const headingId = `profile-result-section-${sectionId}`;

  return (
    <section className="flex flex-col gap-2.5" aria-labelledby={headingId}>
      <div id={headingId} className="txt-st-bold flex flex-wrap items-center gap-1.5">
        <span className="text-purple-700" aria-hidden>
          *
        </span>
        <span>{title}</span>
      </div>
      <ul className="txt-b-regular list-disc pl-5 text-black marker:text-black">
        {items.map((item, index) => (
          <li key={index} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2.5" role="list" aria-label="진단 결과 태그">
      {tags.map((raw, index) => {
        const label = raw.startsWith('#') ? raw : `#${raw}`;
        return (
          <span
            key={`${label}-${index}`}
            role="listitem"
            className="bg-special-navy-700 border-special-navy-100 txt-c1-bold inline-flex rounded-[12px] border-2 px-2.5 py-2 text-white"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
