import type { Intervention } from "../../src/types";
import bodyCompositionDrug from "./body-composition-drug";

export const interventions: Intervention[] = [bodyCompositionDrug];

export function getInterventionById(id: string): Intervention | undefined {
  return interventions.find((intervention) => intervention.id === id);
}

export function getInterventionsByType(type: string): Intervention[] {
  return interventions.filter(
    (intervention) => intervention.metadata?.type === type,
  );
}

export default interventions;
