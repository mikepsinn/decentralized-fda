import type { HealthMetric } from "../../src/types";
import { metabolicMetrics } from "./metabolic-metrics";

export const healthMetrics: HealthMetric[] = [...metabolicMetrics];

export function getMetricById(id: string): HealthMetric | undefined {
  return healthMetrics.find((metric) => metric.id === id);
}

export function getMetricsByCategory(category: string): HealthMetric[] {
  return healthMetrics.filter(
    (metric) => metric.metadata?.category === category,
  );
}

export default healthMetrics;
