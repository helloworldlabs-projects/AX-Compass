import { Badge } from '@/components/ui/badge';
import type { Level } from '@/constants/levelConfig';

interface CurriculumItemProps {
  level: Level;
  type: '메인' | '확장' | '보조';
  title: string;
  duration: string;
  className?: string;
}

const levelVariant = {
  입문: 'beginner',
  초급: 'elementary',
  중급: 'intermediate',
  고급: 'advanced',
} as const;

const typeVariant = {
  메인: 'main',
  확장: 'extended',
  보조: 'supplementary',
} as const;

function CurriculumItem({ level, type, title, duration, className }: CurriculumItemProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className ? ` ${className}` : ''}`}>
      <div className="flex shrink-0 items-center gap-1">
        <Badge variant={levelVariant[level]}>{level}</Badge>
        <Badge variant={typeVariant[type]}>{type}</Badge>
      </div>
      <span className="txt-b-bold flex-1 text-black">{title}</span>
      <span className="txt-b-bold shrink-0 text-black">({duration}h)</span>
    </div>
  );
}

export { CurriculumItem };
