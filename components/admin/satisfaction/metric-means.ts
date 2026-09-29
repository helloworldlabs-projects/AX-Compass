import { METRICS } from '@/lib/admin/metrics';
import type { Cohort } from '@/types/reference';

/** 지표별로 회차 평균을 다시 평균한다 (대시보드 · 만족도 목록). 값이 없는 지표는 mean = null. */
export function metricMeans(cohorts: Cohort[]) {
  return METRICS.map((m) => {
    const vals = cohorts
      .map((c) => c.scores[m.code])
      .filter((v): v is number => typeof v === 'number' && v > 0);
    return {
      ...m,
      mean: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100 : null,
      cohorts: vals.length,
    };
  });
}

export type MetricMean = ReturnType<typeof metricMeans>[number];

/** 평균이 가장 낮은 지표. 값이 하나도 없으면 null. */
export function lowestMetric(means: MetricMean[]): MetricMean | null {
  return means.reduce<MetricMean | null>(
    (lo, m) => (m.mean !== null && (lo === null || m.mean < lo.mean!) ? m : lo),
    null,
  );
}
