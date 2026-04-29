import { cn } from '@/lib/utils';

interface ResultSummaryListProps {
  items: string[];
  className?: string;
}

export function ResultSummaryList({ items, className }: ResultSummaryListProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 rounded-[20px] border border-gray-500 bg-white px-2.5 py-[30px] shadow lg:px-[50px]',
        className,
      )}
    >
      <div className="txt-st-bold">
        <span className="text-purple-700">* </span>
        검사 결과 요약
      </div>
      <ul className="list-outside list-decimal pl-5 text-black marker:text-black">
        {items.map((summary, index) => (
          <li key={index}>
            {summary.split(/\*([^*]*)\*/g).map((word, i) =>
              i % 2 === 0 ? (
                word
              ) : (
                <span key={i} className="txt-b-bold">
                  {word}
                </span>
              ),
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
