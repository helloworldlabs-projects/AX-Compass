import { ReactNode } from 'react';

interface CompetencyCardProps {
  icon: ReactNode;
  name: string;
  nameEn: string;
  description: string;
  subItems: string[];
}

export function CompetencyCard({ icon, name, nameEn, description, subItems }: CompetencyCardProps) {
  return (
    <div className="rounded-card flex min-w-[300px] flex-1 flex-col gap-6 bg-white p-5 shadow lg:max-w-[500px] lg:min-w-[350px] lg:p-[30px]">
      <div className="flex items-center gap-2.5">
        {icon}
        <div>
          <span className="txt-st-bold">{name}</span>{' '}
          <span className="txt-st-regular">({nameEn})</span>
        </div>
      </div>
      <div>{description}</div>
      <div className="bg-purple-0 rounded-card flex-1 p-3 shadow lg:p-5">
        <div className="txt-st2-bold mb-1.5">하위 역량</div>
        <div className="ml-2">
          <ul className="ml-4 flex list-outside list-disc flex-col">
            {subItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
