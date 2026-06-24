import React from 'react';

interface SectionHeaderProps {
  title: React.ReactNode;
  description?: string | string[];
  as?: 'h1' | 'h2';
}

export function SectionHeader({ title, description, as = 'h2' }: SectionHeaderProps) {
  const Heading = as;
  const headingClass =
    as === 'h1' ? 'txt-h2 text-shadow text-center' : 'txt-t1 text-shadow text-center';

  return (
    <div className="flex flex-col items-center gap-1.5 lg:gap-2.5">
      <Heading className={headingClass}>{title}</Heading>
      {description && (
        <p className="text-shadow flex flex-col gap-1 text-center whitespace-pre-line">
          {Array.isArray(description)
            ? description.map((line, i) => <span key={i}>{line}</span>)
            : description}
        </p>
      )}
    </div>
  );
}
