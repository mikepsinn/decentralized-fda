import type { DecisionThresholds } from "../../src/types";
import { medicareThresholds } from "./medicare-thresholds";

export const decisionThresholds: Record<string, DecisionThresholds> = {
  medicare: medicareThresholds,
};

export function getThresholds(type: string = "medicare"): DecisionThresholds {
  return decisionThresholds[type] || medicareThresholds;
}

export default decisionThresholds;
