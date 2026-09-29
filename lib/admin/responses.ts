import { TAG_TO_COMPETENCY, type CompetencyId, type Tag } from '@/lib/admin/ax-scoring';

/** "김 영희"와 "김영희"를 같게 본다. 사전검사 nameKey 와 같은 규칙. */
export function nameKey(name: string): string {
  return name.replace(/\s+/g, '').toLowerCase();
}

/** 하위 역량이 속한 역량. */
export function competencyOfTag(tag: Tag): CompetencyId {
  return TAG_TO_COMPETENCY[tag];
}
