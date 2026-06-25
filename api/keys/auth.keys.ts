export const authKeys = {
  all: ['auth'] as const,
  businessTypes: () => [...authKeys.all, 'businessTypes'] as const,
};
