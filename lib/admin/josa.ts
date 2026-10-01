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

/**
 * 영문 글자·숫자로 끝나는 낱말은 **한글로 읽은 소리**의 받침을 본다.
 * 기업명과 과정명에 영문과 숫자가 그대로 섞여 들어온다 — "헬로월드랩스AX",
 * "n8n", "GPT-4".
 *
 * 받침이 남는 것만 적었다. 엘·엠·엔·알, 그리고 영·일·삼·육·칠·팔이다.
 * 나머지는 모음으로 끝난다 — X 는 "엑스", S 는 "에스", F 는 "에프" 라
 * 받침이 없다. 그래서 "헬로월드랩스AX는"이 맞다.
 *
 * 값이 `'ㄹ'` 인 것은 "으로"에서 받침 없는 것처럼 다뤄야 하는 것들이다.
 */
const SOUND_JONG: Record<string, 'ㄹ' | true> = {
  l: 'ㄹ', // 엘
  r: 'ㄹ', // 알
  '1': 'ㄹ', // 일
  '7': 'ㄹ', // 칠
  '8': 'ㄹ', // 팔
  m: true, // 엠
  n: true, // 엔
  '0': true, // 영
  '3': true, // 삼
  '6': true, // 육
};

export function josa(word: string, kind: JosaKind): string {
  // 뒤에 달린 괄호·따옴표·마침표는 소리에 들지 않는다. "…(24시간)" 은 "간"으로 읽는다.
  const trimmed = word.trim().replace(/[^0-9A-Za-z가-힣]+$/u, '');
  const last = (trimmed || word.trim()).slice(-1);
  const code = last.charCodeAt(0);

  if (code >= 0xac00 && code <= 0xd7a3) {
    const jong = (code - 0xac00) % 28;
    // "으로"만 예외다. ㄹ 받침(8)은 받침 없는 것처럼 "로"를 쓴다.
    if (kind === '으로' && jong === 8) return '로';
    return jong === 0 ? PAIRS[kind][1] : PAIRS[kind][0];
  }

  const key = last.toLowerCase();
  if (/[0-9a-z]/.test(key)) {
    const jong = SOUND_JONG[key];
    if (kind === '으로' && jong === 'ㄹ') return '로';
    return jong === undefined ? PAIRS[kind][1] : PAIRS[kind][0];
  }

  // 한글도 영문도 숫자도 아니면(기호만 남은 이름 등) 받침이 있는 쪽으로 둔다.
  return PAIRS[kind][0];
}

/** 낱말 뒤에 조사를 붙여 돌려준다. */
export function with_(word: string, kind: JosaKind): string {
  return `${word}${josa(word, kind)}`;
}
