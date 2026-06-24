import type { PrivacyContent, PrivacyVersion } from '@/data/privacy/types';

function ArticleCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card flex w-full flex-col gap-4 border border-gray-100 p-4 lg:p-6">
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <p className="txt-st-bold text-black">{title}</p>
      <div className="txt-b-regular text-gray-700">{children}</div>
    </div>
  );
}

function NumberedList({ intro, items }: { intro?: string; items: string[] }) {
  return (
    <div className="txt-b-regular flex flex-col gap-0.5 text-gray-700">
      {intro && <p className="mb-1">{intro}</p>}
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <span className="w-5 shrink-0 tabular-nums">{i + 1}.</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function Dot() {
  return <span className="mt-[9px] size-1 shrink-0 rounded-full bg-gray-700" />;
}

function DotItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 pl-2.5">
      <Dot />
      <div className="txt-b-regular text-gray-700">{children}</div>
    </div>
  );
}

function SubDotItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 pl-8">
      <Dot />
      <p className="txt-b-regular text-gray-700">{children}</p>
    </div>
  );
}

function SubSection({ label, paragraphs }: { label: string; paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      <DotItem>
        <p>{label}</p>
      </DotItem>
      {paragraphs.map((p, i) => (
        <SubDotItem key={i}>{p}</SubDotItem>
      ))}
    </div>
  );
}

export function PrivacyContentBlock({ content }: { content: PrivacyContent }) {
  switch (content.type) {
    case 'paragraph':
      if (content.dot) {
        return (
          <DotItem>
            <p className={`whitespace-pre-line${content.bold ? ' txt-b-bold' : ''}`}>
              {content.text}
            </p>
          </DotItem>
        );
      }
      return (
        <p className={`whitespace-pre-line${content.bold ? ' txt-b-bold' : ''}`}>{content.text}</p>
      );
    case 'numbered-list':
      return <NumberedList intro={content.intro} items={content.items} />;
    case 'dot-list':
      return (
        <div className="flex flex-col gap-0.5 text-gray-700">
          {content.intro && <p className="txt-b-regular mb-1">{content.intro}</p>}
          {content.items.map((item, i) => (
            <DotItem key={i}>
              <p className="txt-b-regular">{item}</p>
            </DotItem>
          ))}
        </div>
      );
    case 'subsection':
      return <SubSection label={content.label} paragraphs={content.paragraphs} />;
    case 'subsection-group':
      return (
        <div className="flex flex-col">
          {content.subsections.map((sub, i) => (
            <SubSection key={i} label={sub.label} paragraphs={sub.paragraphs} />
          ))}
        </div>
      );
    case 'contact-info':
      return (
        <div className="flex flex-col gap-0.5">
          <DotItem>
            <p>담당자: {content.manager}</p>
          </DotItem>
          <DotItem>
            <p>담당부서: {content.department}</p>
          </DotItem>
          <DotItem>
            <p>
              문의처:{' '}
              <a href={`mailto:${content.email}`} className="underline">
                {content.email}
              </a>
            </p>
          </DotItem>
          <DotItem>
            <p>근무시간: {content.hours}</p>
          </DotItem>
          <p className="txt-b-regular mt-2 whitespace-pre-line text-gray-700">{content.note}</p>
          {content.agencies.map((agency, i) => (
            <DotItem key={i}>
              <p>
                {agency.name}: {agency.phone}
              </p>
            </DotItem>
          ))}
        </div>
      );
  }
}

export function PrivacyArticle({ privacy }: { privacy: PrivacyVersion }) {
  return (
    <ArticleCard>
      {privacy.sections.map((section, i) => (
        <Section key={i} title={section.title}>
          <div className="flex flex-col">
            {section.content.map((content, j) => (
              <PrivacyContentBlock key={j} content={content} />
            ))}
          </div>
        </Section>
      ))}
      <p className="txt-b-regular text-gray-700">{privacy.effectiveDateLabel}</p>
    </ArticleCard>
  );
}
