/**
 * 조사 붙이기.
 *
 * 해설 문장을 자동으로 만들다 보면 "행동빈도이 낮습니다"처럼 어긋난 조사가
 * 나온다. 기업에 나가는 문서라 이런 자리가 눈에 걸린다.
 *
 * 받침이 있는지로 고른다. 한글 음절은 0xAC00 부터 28개 단위로 종성이 돌므로,
 * 나머지가 0 이면 받침이 없다.
 */
const PAIRS = {
  이: ['이', '가'],
  은: ['은', '는'],
  을: ['을', '를'],
  과: ['과', '와'],
  으로: ['으로', '로'],
} as const;

export type JosaKind = keyof typeof PAIRS;

export function josa(word: string, kind: JosaKind): string {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0);

  // 한글 음절이 아니면(영문·숫자·괄호 등) 받침이 있는 쪽으로 둔다.
  // 대부분 영문 약어라 "N8N은", "AI가"처럼 읽히는 쪽이 자연스럽다.
  if (Number.isNaN(code) || code < 0xac00 || code > 0xd7a3) {
    return PAIRS[kind][0];
  }

  const jong = (code - 0xac00) % 28;
  // "으로"만 예외다. ㄹ 받침(8)은 받침 없는 것처럼 "로"를 쓴다.
  if (kind === '으로' && jong === 8) return '로';
  return jong === 0 ? PAIRS[kind][1] : PAIRS[kind][0];
}

/** 낱말 뒤에 조사를 붙여 돌려준다. */
export function with_(word: string, kind: JosaKind): string {
  return `${word}${josa(word, kind)}`;
}
