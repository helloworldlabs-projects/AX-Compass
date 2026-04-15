import {
  ExamineeProfiles,
  ExamItems,
  ExamSubmitRequest,
  ExamType,
  ExpectationForm,
  ItemComponent,
  ItemType,
  QuestionDTO,
  QuestionType,
} from '@/types/exam';
import { apiFetch } from '../client';

// ─── Raw API response types (actual field names from server) ──────────────────

interface RawQuestionOption {
  code: string;
  label: string;
}

interface RawQuestion {
  questionCode: string;
  title: string;
  type: QuestionType;
  options: RawQuestionOption[];
  description?: string | null;
  maxLength?: number | null;
  required?: boolean;
}

interface RawFormDTO {
  formTitle: string;
  questions: RawQuestion[];
}

interface RawItemOption {
  optionCode: string;
  optionText: string;
}

interface RawExamItem {
  itemId: number;
  itemCode: string;
  displayOrder: number;
  prompt: string;
  options: RawItemOption[];
}

interface RawExamSection {
  component: ItemComponent;
  sectionName: string;
  itemType: ItemType;
  scaleMin: number | null;
  scaleMax: number | null;
  items: RawExamItem[];
}

interface RawExamItemsDTO {
  examType: ExamType;
  totalItems: number;
  sections: RawExamSection[];
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapQuestion(raw: RawQuestion): QuestionDTO {
  const options = (raw.options ?? []).map((o) => ({ value: o.code, label: o.label }));

  if (raw.type === 'SINGLE_CHOICE') {
    return {
      questionCode: raw.questionCode,
      type: 'SINGLE_CHOICE',
      title: raw.title,
      required: raw.required ?? true,
      options,
    };
  }
  if (raw.type === 'MULTI_CHOICE') {
    return {
      questionCode: raw.questionCode,
      type: 'MULTI_CHOICE',
      title: raw.title,
      required: raw.required ?? true,
      options,
    };
  }
  return {
    questionCode: raw.questionCode,
    type: 'TEXT',
    title: raw.title,
    required: raw.required ?? false,
    maxLength: raw.maxLength ?? undefined,
  };
}

function mapForm(raw: RawFormDTO): ExpectationForm | ExamineeProfiles {
  return {
    formTitle: raw.formTitle,
    questions: raw.questions.map(mapQuestion),
  };
}

function mapExamItems(raw: RawExamItemsDTO): ExamItems {
  return {
    examType: raw.examType,
    totalItems: raw.totalItems,
    sections: raw.sections.map((section) => ({
      component: section.component,
      itemType: section.itemType,
      scaleMin: section.scaleMin ?? undefined,
      scaleMax: section.scaleMax ?? undefined,
      items: section.items.map((item) => ({
        itemId: item.itemId,
        itemCode: item.itemCode,
        sequence: item.displayOrder,
        content: item.prompt,
        options: (item.options ?? []).map((o) => ({
          value: o.optionCode,
          label: o.optionText,
        })),
      })),
    })),
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const examService = {
  getExpectationForm: async (): Promise<ExpectationForm> => {
    const raw = await apiFetch<RawFormDTO>('/exam/expectation-form');
    return mapForm(raw) as ExpectationForm;
  },

  getExamineeProfiles: async (): Promise<ExamineeProfiles> => {
    const raw = await apiFetch<RawFormDTO>('/exam/examinee-profiles');
    return mapForm(raw) as ExamineeProfiles;
  },

  getExamItems: async (examType: ExamType): Promise<ExamItems> => {
    const raw = await apiFetch<RawExamItemsDTO>(`/exam/items?examType=${examType}`);
    return mapExamItems(raw);
  },

  submitExam: async (body: ExamSubmitRequest): Promise<void> => {
    await apiFetch<void>('/exam/submit', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
