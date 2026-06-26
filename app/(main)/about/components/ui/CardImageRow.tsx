import Image from 'next/image';
import { ReactNode } from 'react';

interface CardImageRowProps {
  title: string;
  items: ReactNode[];
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
}

export function CardImageRow({ title, items, imageSrc, imageWidth, imageHeight }: CardImageRowProps) {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="bg-purple-0 rounded-card min-w-[300px] flex-1 p-3 shadow lg:max-w-[470px] lg:p-5">
        <div className="txt-st2-bold mb-1.5">{title}</div>
        <div className="ml-2">
          <ul className="ml-4 flex list-outside list-disc flex-col">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="min-w-[300px] flex-1 lg:max-w-[470px]">
        <Image
          src={imageSrc}
          alt=""
          width={imageWidth}
          height={imageHeight}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
