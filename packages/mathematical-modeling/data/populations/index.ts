import type { Population } from "../../src/types";
import usDiabetesPopulation from "./us-diabetes-population";

export const populations: Population[] = [usDiabetesPopulation];

export function getPopulationById(id: string): Population | undefined {
  return populations.find((population) => population.id === id);
}

export default populations;
