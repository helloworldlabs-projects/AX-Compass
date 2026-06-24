export const dashboardKeys = {
  all: ['dashboard'] as const,
  institutions: () => [...dashboardKeys.all, 'institutions'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
};
