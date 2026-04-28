export type ParagraphContent = {
  type: 'paragraph';
  text: string;
  bold?: boolean;
  dot?: boolean;
};

export type NumberedListContent = {
  type: 'numbered-list';
  intro?: string;
  items: string[];
};

export type DotListContent = {
  type: 'dot-list';
  intro?: string;
  items: string[];
};

export type SubsectionContent = {
  type: 'subsection';
  label: string;
  paragraphs: string[];
};

export type SubsectionGroupContent = {
  type: 'subsection-group';
  subsections: SubsectionContent[];
};

export type ContactInfoContent = {
  type: 'contact-info';
  manager: string;
  department: string;
  email: string;
  hours: string;
  note: string;
  agencies: { name: string; phone: string }[];
};

export type PrivacyContent =
  | ParagraphContent
  | NumberedListContent
  | DotListContent
  | SubsectionContent
  | SubsectionGroupContent
  | ContactInfoContent;

export interface PrivacySection {
  title: string;
  content: PrivacyContent[];
}

export interface PrivacyVersion {
  version: string;
  effectiveDate: string;
  label: string;
  effectiveDateLabel: string;
  sections: PrivacySection[];
}
