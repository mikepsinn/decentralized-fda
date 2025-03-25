import type { EconomicOutcome } from "../../src/types";
import { healthcareCosts } from "./healthcare-costs";

export const economicOutcomes: EconomicOutcome[] = [...healthcareCosts];

export function getOutcomeById(id: string): EconomicOutcome | undefined {
  return economicOutcomes.find((outcome) => outcome.id === id);
}

export function getOutcomesByCategory(category: string): EconomicOutcome[] {
  return economicOutcomes.filter((outcome) => outcome.category === category);
}

export default economicOutcomes;
