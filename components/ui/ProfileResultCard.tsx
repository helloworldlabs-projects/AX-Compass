import { cn } from '@/lib/utils';
import Image from 'next/image';

export type ProfileType =
  | 'BALANCED'
  | 'DOER'
  | 'ANALYST'
  | 'LEARNER'
  | 'OVERCONFIDENT'
  | 'CAUTIOUS';

type ProfileData = {
  typeLabel: string;
  typeEn: string;
  imageUrl: string;
  description: string;
  strengths: string[];
  improvements: string[];
  tags: string[];
};

const PROFILE_DATA: Record<ProfileType, ProfileData> = {
  BALANCED: {
    typeLabel: '균형형',
    typeEn: 'Balanced',
    imageUrl: '/images/profile-type/img_balanced.png',
    description:
      '판단과 실행이 고르게 나타나며, AX를 이해하는 과정과 실제 활용하는 과정이 비교적 안정적으로 균형을 이루는 타입.',
    strengths: [
      '필요한 순간에 AI를 적절하게 활용해 생산성을 꾸준히 높일 수 있다.',
      '결과를 검토하고 다듬는 루틴이 있어 실무 품질이 비교적 안정적으로 유지된다.',
      '활용 기준과 작업 방식이 정리되어 있어 업무 적용 흐름이 예측 가능하고 일관적이다.',
    ],
    improvements: [
      '반복 업무를 자동화하거나 템플릿화하면 활용 범위를 더 넓힐 수 있다.',
      '워크플로우 연결이나 협업 방식까지 확장하면 AX 활용 효과를 한 단계 더 높일 수 있다.',
      '개인의 활용 방식을 팀 단위의 베스트 프랙티스로 정리하면 조직 확산 효과가 커질 수 있다.',
    ],
    tags: ['#자기평가_현실일치', '#상황판단_높음', '#행동빈도_높음', '#균형갭_작음'],
  },
  DOER: {
    typeLabel: '실행형',
    typeEn: 'Doer',
    imageUrl: '/images/profile-type/img_doer.png',
    description:
      '실행 전환이 빠르고 새로운 도구를 실제로 활용해보는 데 적극적이며, 직접 써보는 경험을 통해 활용 감각과 적용 범위를 넓혀가는 타입.',
    strengths: [
      '업무 적용 속도가 빠르고 새로운 방식도 부담 없이 시도해볼 수 있다.',
      '도구나 프롬프트를 실제 업무 흐름에 자연스럽게 연결해 활용하는 데 익숙하다.',
      '직접 사용해보며 개선점을 찾고, 실무 안에서 빠르게 활용 가능성을 확인해 나간다.',
    ],
    improvements: [
      '출처 확인이나 테스트 같은 검증 루틴을 함께 갖추면 결과 품질이 더 안정될 수 있다.',
      '민감정보·저작권·사실 확인 기준을 정리하면 활용 범위를 더 안전하게 넓힐 수 있다.',
      '요청 방식과 출력 형식을 표준화하면 결과 편차를 줄이고 재사용성을 높일 수 있다.',
    ],
    tags: ['#행동빈도_매우높음', '#상황판단_중간이하', '#실행우선', '#빠른활용전환'],
  },
  ANALYST: {
    typeLabel: '판단형',
    typeEn: 'Analyst',
    imageUrl: '/images/profile-type/img_analyst.png',
    description:
      '위험 요소와 활용 맥락을 신중하게 살피는 편이며, 충분한 검토와 판단을 바탕으로 실행 방향과 활용 가능성을 정리해 나가는 타입.',
    strengths: [
      '결과의 허점이나 누락 가능성을 비교적 빠르게 발견하고 점검할 수 있다.',
      '보안·윤리·품질 기준을 중요하게 여기며 안정적인 활용 방향을 잡는 데 강점이 있다.',
      '의사결정의 전제와 기준을 정리해 팀 내 커뮤니케이션을 명확하게 만드는 데 도움이 된다.',
    ],
    improvements: [
      '작은 과제부터 빠르게 적용해보는 경험이 쌓이면 판단이 실제 성과로 더 잘 이어질 수 있다.',
      '완성도를 확보한 뒤 시작하기보다 템플릿 기반으로 반복 사용을 시작하면 활용 폭이 넓어진다.',
      '일정한 사용 루틴을 만들면 신중한 판단력이 실무 활용력으로 더 자연스럽게 연결될 수 있다.',
    ],
    tags: ['#상황판단_매우높음', '#행동빈도_낮음', '#판단우선', '#신중한실행전환'],
  },
  LEARNER: {
    typeLabel: '이해형',
    typeEn: 'Learner',
    imageUrl: '/images/profile-type/img_learner.png',
    description:
      '개념과 원리를 먼저 이해하는 데 강점이 있으며, 이해한 내용을 바탕으로 실제 적용 가능성과 활용 방법을 차근차근 연결해 나가는 타입.',
    strengths: [
      'AI의 구조와 한계, 주의할 점을 비교적 잘 이해하고 설명할 수 있다.',
      '새로운 개념이나 가이드를 받아들이는 속도가 빨라 학습 흡수력이 좋은 편이다.',
      '기본 이해를 바탕으로 성장 여지가 커, 적용 경험이 쌓일수록 빠르게 확장될 가능성이 있다.',
    ],
    improvements: [
      '업무를 나누고 요청을 구조화하는 적용 방식을 익히면 이해가 활용으로 더 잘 이어질 수 있다.',
      '반복적으로 사용하는 루틴을 만들면 학습한 내용이 실제 업무 습관으로 자리잡는 데 도움이 된다.',
      '결과를 점검하는 최소 기준을 정리하면 활용 자신감과 적용 안정성을 함께 높일 수 있다.',
    ],
    tags: ['#자기평가_높음', '#상황판단_중간', '#행동빈도_낮음', '#이해중심성장'],
  },
  OVERCONFIDENT: {
    typeLabel: '과신형',
    typeEn: 'Overconfident',
    imageUrl: '/images/profile-type/img_overconfident.png',
    description:
      '자신감을 바탕으로 새로운 도구나 방식을 빠르게 시도하는 편이며, 판단과 검증보다 확신이 먼저 형성되는 경향이 비교적 뚜렷하게 나타나는 타입.',
    strengths: [
      '새로운 도구나 방식을 주저하지 않고 먼저 시도해보는 추진력이 강하다.',
      '아이디어 발산이나 초안 작성 단계에서 속도감 있게 결과를 만들어낼 수 있다.',
      '변화에 대한 거부감이 낮아 새로운 활용 방식을 빠르게 받아들이고 실행으로 옮길 수 있다.',
    ],
    improvements: [
      '근거 확인과 수정, 재검토 루틴을 함께 갖추면 강한 추진력이 더 안정적인 성과로 이어질 수 있다.',
      '보안·저작권·사실 확인 기준을 미리 정리하면 활용 과정의 신뢰도를 높이는 데 도움이 된다.',
      '결과 품질을 점검할 수 있는 기준을 마련하면 확신과 실행력이 더 효과적으로 발휘될 수 있다.',
    ],
    tags: ['#자기평가_매우높음', '#상황판단_낮음', '#확신우선', '#검토보완필요'],
  },
  CAUTIOUS: {
    typeLabel: '조심형',
    typeEn: 'Cautious',
    imageUrl: '/images/profile-type/img_cautious.png',
    description:
      '안정성과 익숙함을 우선해 새로운 활용에 천천히 접근하는 편이며, 부담이 낮고 익숙한 방식부터 활용 범위를 점차 넓혀가는 타입.',
    strengths: [
      '리스크에 대한 감각이 있어 민감정보나 규정 위반 가능성을 낮추는 데 강점이 있다.',
      '기준이 정리된 환경에서는 비교적 안정적이고 일관된 방식으로 활용을 이어갈 수 있다.',
      '예외 상황이나 위험 요소를 먼저 고려해 안전한 활용 흐름을 만드는 데 도움이 된다.',
    ],
    improvements: [
      '안전한 사용 템플릿을 바탕으로 작은 과제부터 시작하면 활용 진입 장벽을 낮출 수 있다.',
      '결과를 스스로 점검할 수 있는 체크리스트를 갖추면 활용 자신감을 높이는 데 도움이 된다.',
      '시도 빈도를 높일 수 있는 최소 루틴을 만들면 활용 경험과 적용 범위를 점차 넓혀갈 수 있다.',
    ],
    tags: ['#자기평가_낮음', '#행동빈도_낮음', '#신중한시작', '#안정우선활용'],
  },
};

export function ProfileResultCard({ type, className }: { type: ProfileType; className?: string }) {
  const { typeLabel, typeEn, imageUrl, description, strengths, improvements, tags } =
    PROFILE_DATA[type];

  return (
    <article className={cn('flex w-full flex-col gap-[50px]', className)}>
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
}: {
  typeLabel: string;
  typeEn: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline gap-x-1.5 text-black">
        <div className="flex gap-1.5" aria-hidden>
          <span className="txt-t1 text-special-pink-500">* </span>
          <div className="flex items-end gap-1.5">
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
