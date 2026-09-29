export const referenceKeys = {
  all: ['reference'] as const,
  institutions: () => [...referenceKeys.all, 'institutions'] as const,
  institutionSatisfactions: () => [...referenceKeys.all, 'institutionSatisfactions'] as const,
  learningCompanies: (institutionId: number) =>
    [...referenceKeys.all, 'learningCompanies', institutionId] as const,
  institutionMetrics: (institutionId: number) =>
    [...referenceKeys.all, 'institutionMetrics', institutionId] as const,
  institutionCohorts: (institutionId: number) =>
    [...referenceKeys.all, 'institutionCohorts', institutionId] as const,
  cohorts: () => [...referenceKeys.all, 'cohorts'] as const,
  offeringsForIssue: () => [...referenceKeys.all, 'offeringsForIssue'] as const,
  offeringQuestions: (offeringId: string) =>
    [...referenceKeys.all, 'offeringQuestions', offeringId] as const,
  offeringsMetrics: (offeringIds: string[]) =>
    [...referenceKeys.all, 'offeringsMetrics', offeringIds] as const,
  courseOverviews: (offeringIds: string[]) =>
    [...referenceKeys.all, 'courseOverviews', offeringIds] as const,
  offeringsQuestions: (offeringIds: string[]) =>
    [...referenceKeys.all, 'offeringsQuestions', offeringIds] as const,
  offeringsChoices: (offeringIds: string[]) =>
    [...referenceKeys.all, 'offeringsChoices', offeringIds] as const,
  preOrgs: () => [...referenceKeys.all, 'preOrgs'] as const,
  preOrg: (institutionId: number) => [...referenceKeys.all, 'preOrg', institutionId] as const,
  preMembers: (institutionId: number) =>
    [...referenceKeys.all, 'preMembers', institutionId] as const,
  preNameHits: (name: string) => [...referenceKeys.all, 'preNameHits', name] as const,
};
