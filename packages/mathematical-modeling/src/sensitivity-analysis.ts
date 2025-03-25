import {
  Intervention,
  Parameter,
  SensitivityAnalysis,
  ParameterVariation,
  SensitivityResult
} from './types';
import { CalculationEngine } from './calculation-engine';

/**
 * Sensitivity analysis module for analyzing parameter uncertainty
 */
export class SensitivityAnalyzer {
  private calculationEngine: CalculationEngine;

  constructor() {
    this.calculationEngine = new CalculationEngine();
  }

  /**
   * Perform one-way sensitivity analysis by varying each parameter individually
   */
  public performOneWaySensitivityAnalysis(
    intervention: Intervention,
    populationId: string,
    populationSize: number,
    parameters: Parameter[],
    steps = 5
  ): SensitivityAnalysis {
    const variations: ParameterVariation[] = parameters.map(param => ({
      parameterId: param.id,
      values: this.generateParameterValues(param, steps)
    }));

    const results: SensitivityResult[] = [];

    // For each parameter variation
    variations.forEach(variation => {
      variation.values.forEach(value => {
        // Create parameter override
        const parameterValues: Record<string, number> = {
          [variation.parameterId]: value
        };

        // Calculate results with this parameter value
        const result = this.calculationEngine.calculateInterventionImpact(
          intervention,
          populationId,
          populationSize,
          parameterValues
        );

        // Extract economic outcomes
        const economicOutcomes: Record<string, number> = {};
        result.economicOutcomes.forEach(outcome => {
          economicOutcomes[outcome.metricId] = outcome.absoluteChange;
        });

        // Add to results
        results.push({
          parameterValues: { [variation.parameterId]: value },
          economicOutcomes
        });
      });
    });

    return {
      id: `sensitivity-${intervention.id}-${Date.now()}`,
      calculationResultId: intervention.id,
      parameterVariations: variations,
      results
    };
  }

  /**
   * Perform probabilistic sensitivity analysis using Monte Carlo simulation
   */
  public performProbabilisticSensitivityAnalysis(
    intervention: Intervention,
    populationId: string,
    populationSize: number,
    parameters: Parameter[],
    iterations = 1000
  ): SensitivityAnalysis {
    const results: SensitivityResult[] = [];

    // Run Monte Carlo simulation
    for (let i = 0; i < iterations; i++) {
      // Generate random parameter values
      const parameterValues: Record<string, number> = {};
      parameters.forEach(param => {
        parameterValues[param.id] = this.generateRandomParameterValue(param);
      });

      // Calculate results with these parameter values
      const result = this.calculationEngine.calculateInterventionImpact(
        intervention,
        populationId,
        populationSize,
        parameterValues
      );

      // Extract economic outcomes
      const economicOutcomes: Record<string, number> = {};
      result.economicOutcomes.forEach(outcome => {
        economicOutcomes[outcome.metricId] = outcome.absoluteChange;
      });

      // Add to results
      results.push({
        parameterValues,
        economicOutcomes
      });
    }

    return {
      id: `monte-carlo-${intervention.id}-${Date.now()}`,
      calculationResultId: intervention.id,
      parameterVariations: parameters.map(param => ({
        parameterId: param.id,
        values: [param.defaultValue]
      })),
      results
    };
  }

  /**
   * Generate a sequence of parameter values for sensitivity analysis
   */
  private generateParameterValues(parameter: Parameter, steps: number): number[] {
    const min = parameter.worstCaseValue ?? parameter.defaultValue * 0.5;
    const max = parameter.bestCaseValue ?? parameter.defaultValue * 1.5;
    const step = (max - min) / (steps - 1);

    return Array.from({ length: steps }, (_, i) => min + step * i);
  }

  /**
   * Generate a random parameter value within its uncertainty range
   */
  private generateRandomParameterValue(parameter: Parameter): number {
    const min = parameter.worstCaseValue ?? parameter.defaultValue * 0.5;
    const max = parameter.bestCaseValue ?? parameter.defaultValue * 1.5;

    // Use triangular distribution centered on default value
    const r = Math.random();
    const f = (parameter.defaultValue - min) / (max - min);

    if (r < f) {
      return min + Math.sqrt(r * (max - min) * (parameter.defaultValue - min));
    } else {
      return max - Math.sqrt((1 - r) * (max - min) * (max - parameter.defaultValue));
    }
  }

  /**
   * Calculate confidence intervals from Monte Carlo results
   */
  public calculateConfidenceIntervals(
    results: SensitivityResult[],
    confidence = 0.95
  ): Record<string, { lower: number; upper: number }> {
    const intervals: Record<string, { lower: number; upper: number }> = {};

    // Get all outcome IDs
    const outcomeIds = new Set<string>();
    results.forEach(result => {
      Object.keys(result.economicOutcomes).forEach(id => outcomeIds.add(id));
    });

    // Calculate intervals for each outcome
    outcomeIds.forEach(id => {
      const values = results
        .map(r => r.economicOutcomes[id])
        .filter(v => v !== undefined)
        .sort((a, b) => a - b);

      const lowerIndex = Math.floor(values.length * ((1 - confidence) / 2));
      const upperIndex = Math.floor(values.length * (1 - (1 - confidence) / 2));

      intervals[id] = {
        lower: values[lowerIndex],
        upper: values[upperIndex]
      };
    });

    return intervals;
  }
} 