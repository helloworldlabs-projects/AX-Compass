import {
  ExamineeProfiles,
  ExamineeProfilesDTO,
  ExamItems,
  ExamItemsDTO,
  ExamType,
  ExpectationForm,
  ExpectationFormDTO,
} from '@/types/exam';
import { apiFetch } from '../client';

// ─── Mappers ──────────────────────────────────────────────────────────────────

const mapExpectationForm = (dto: ExpectationFormDTO): ExpectationForm => ({
  formTitle: dto.formTitle,
  questions: dto.questions,
});

const mapExamineeProfiles = (dto: ExamineeProfilesDTO): ExamineeProfiles => ({
  formTitle: dto.formTitle,
  questions: dto.questions,
});

const mapExamItems = (dto: ExamItemsDTO): ExamItems => ({
  examType: dto.examType,
  totalItems: dto.totalItems,
  sections: dto.sections,
});

// ─── Service ──────────────────────────────────────────────────────────────────

export const examService = {
  getExpectationForm: async (): Promise<ExpectationForm> => {
    const dto = await apiFetch<ExpectationFormDTO>('/exam/expectation-form');
    return mapExpectationForm(dto);
  },

  getExamineeProfiles: async (): Promise<ExamineeProfiles> => {
    const dto = await apiFetch<ExamineeProfilesDTO>('/exam/examinee-profiles');
    return mapExamineeProfiles(dto);
  },

  getExamItems: async (examType: ExamType): Promise<ExamItems> => {
    const dto = await apiFetch<ExamItemsDTO>(`/exam/items?examType=${examType}`);
    return mapExamItems(dto);
  },
};
