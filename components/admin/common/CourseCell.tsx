import { Badge } from '@/components/admin/ui';

/**
 * 목록의 과정 칸.
 *
 * 운영 건을 여러 개 묶은 링크는 첫 이름만 적으면 나머지가 보이지 않는다.
 * 몇 건이 더 있는지를 **알약으로** 붙인다 — 글자로 두면 줄이 갈릴 때
 * "외" 와 "1건" 이 위아래로 떨어져 읽기 어렵다.
 *
 * 알약이 다음 줄로 내려가는 일이 흔하므로 줄 간격을 넉넉히 준다. 기본
 * 간격으로 두면 제목 줄과 알약이 붙어 한 덩어리처럼 보인다.
 *
 * 알약이 다음 줄로 내려가는 일이 흔하므로 줄 간격을 넉넉히 준다. 기본
 * 간격으로 두면 제목 줄과 알약이 붙어 한 덩어리처럼 보인다.
 *
 * 이름이 길면 줄을 내려 다 보여 준다. 한 줄로 잘라 "…" 으로 끝내면 과정이
 * 무엇인지 알 수 없어, 목록에서 줄을 고를 수가 없다.
 *
 * 발송·조회·보고서 목록이 같은 것을 쓴다. 화면마다 따로 적으면 한 곳만
 * 고쳐지고 나머지는 옛 모양으로 남는다.
 */
export function CourseCell({
  offerings,
  fallback,
}: {
  offerings: { title: string }[];
  fallback: string | null;
}) {
  const [first, ...rest] = offerings;
  const title = first?.title ?? fallback ?? '과정 미지정';
  const full = rest.length === 0 ? title : `${title} 외 ${rest.length}건`;

  return (
    <span className="block leading-[1.9] break-keep" title={full}>
      {title}
      {rest.length > 0 && (
        <span className="my-0.5 ml-1.5 inline-block align-middle">
          <Badge tone="info">외 {rest.length}건</Badge>
        </span>
      )}
    </span>
  );
}
