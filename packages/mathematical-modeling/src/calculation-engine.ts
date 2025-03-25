import {
  Intervention,
  CalculationResult,
  Parameter,
  PrimaryOutcome,
  SecondaryOutcome,
  HealthMetricResult,
  EconomicOutcomeResult,
  EconomicImpactResult,
  CostEffectivenessMetrics,
  BudgetImpactAnalysis,
  MedicareImpactAnalysis
} from './types';
import { EquationParser } from './equation-parser';

/**
 * Core calculation engine for health & economic impact analysis
 */
export class CalculationEngine {
  private equationParser: EquationParser;

  constructor() {
    this.equationParser = new EquationParser();
  }

  /**
   * Calculate the complete impact of an intervention on a population
   */
  public calculateInterventionImpact(
    intervention: Intervention,
    populationId: string,
    populationSize: number,
    parameterOverrides?: Record<string, number>
  ): CalculationResult {
    const timestamp = new Date().toISOString();
    const parameterValues = this.resolveParameterValues(intervention, parameterOverrides);
    
    // Calculate primary and secondary outcomes
    const healthMetrics = this.calculateHealthMetrics(intervention.primaryOutcomes, parameterValues);
    const economicOutcomes = this.calculateEconomicOutcomes(intervention.primaryOutcomes, parameterValues, populationSize);
    const totalEconomicImpact = this.calculateTotalEconomicImpact(economicOutcomes);
    
    // Calculate decision metrics
    const costEffectivenessMetrics = this.calculateCostEffectiveness(economicOutcomes, healthMetrics);
    const budgetImpact = this.calculateBudgetImpact(economicOutcomes, populationSize);
    const medicareImpact = this.calculateMedicareImpact(economicOutcomes, populationSize);

    return {
      interventionId: intervention.id,
      populationId,
      populationSize,
      timestamp,
      parameterValues,
      healthMetrics,
      economicOutcomes,
      totalEconomicImpact,
      costEffectivenessMetrics,
      budgetImpact,
      medicareImpact
    };
  }

  /**
   * Resolve parameter values, applying any overrides
   */
  private resolveParameterValues(
    intervention: Intervention,
    overrides?: Record<string, number>
  ): Record<string, number> {
    const values: Record<string, number> = {};
    
    // Collect all parameters from primary and secondary outcomes
    const allParameters = this.collectAllParameters(intervention);
    
    // Set default values first
    allParameters.forEach(param => {
      values[param.id] = param.defaultValue;
    });
    
    // Apply any overrides
    if (overrides) {
      Object.entries(overrides).forEach(([id, value]) => {
        values[id] = value;
      });
    }
    
    return values;
  }

  /**
   * Calculate health metrics from primary outcomes
   */
  private calculateHealthMetrics(
    primaryOutcomes: PrimaryOutcome[],
    parameterValues: Record<string, number>
  ): HealthMetricResult[] {
    return primaryOutcomes.map(outcome => ({
      metricId: outcome.id,
      baselineValue: 0, // Baseline is typically 0 for primary outcomes
      postInterventionValue: outcome.defaultValue,
      absoluteChange: outcome.defaultValue,
      relativeChange: 100, // 100% change from 0
      lowerBound: outcome.worstCaseValue ?? outcome.defaultValue * 0.8,
      upperBound: outcome.bestCaseValue ?? outcome.defaultValue * 1.2
    }));
  }

  /**
   * Calculate economic outcomes from secondary outcomes
   */
  private calculateEconomicOutcomes(
    primaryOutcomes: PrimaryOutcome[],
    parameterValues: Record<string, number>,
    populationSize: number
  ): EconomicOutcomeResult[] {
    const results: EconomicOutcomeResult[] = [];
    
    primaryOutcomes.forEach(primary => {
      primary.secondaryOutcomes.forEach(secondary => {
        if (this.isEconomicOutcome(secondary)) {
          const baselineValue = this.evaluateEquation(secondary.baselineEquationText ?? "0", parameterValues, populationSize);
          const postValue = this.evaluateEquation(secondary.equationText, parameterValues, populationSize);
          
          results.push({
            metricId: secondary.id,
            baselineValue,
            postInterventionValue: postValue,
            absoluteChange: postValue - baselineValue,
            relativeChange: baselineValue !== 0 ? ((postValue - baselineValue) / baselineValue) * 100 : 100,
            lowerBound: postValue * 0.8, // Simple 20% confidence interval for now
            upperBound: postValue * 1.2
          });
        }
      });
    });
    
    return results;
  }

  /**
   * Calculate total economic impact by summing all economic outcomes
   */
  private calculateTotalEconomicImpact(
    economicOutcomes: EconomicOutcomeResult[]
  ): EconomicImpactResult {
    const baselineValue = economicOutcomes.reduce((sum, outcome) => sum + outcome.baselineValue, 0);
    const postValue = economicOutcomes.reduce((sum, outcome) => sum + outcome.postInterventionValue, 0);
    
    return {
      metricId: 'total-economic-impact',
      baselineValue,
      postInterventionValue: postValue,
      absoluteChange: postValue - baselineValue,
      relativeChange: baselineValue !== 0 ? ((postValue - baselineValue) / baselineValue) * 100 : 100,
      lowerBound: postValue * 0.8,
      upperBound: postValue * 1.2
    };
  }

  /**
   * Calculate cost-effectiveness metrics
   */
  private calculateCostEffectiveness(
    economicOutcomes: EconomicOutcomeResult[],
    healthMetrics: HealthMetricResult[]
  ): CostEffectivenessMetrics {
    // Find relevant metrics
    const costs = economicOutcomes.find(o => o.metricId.includes('cost'))?.absoluteChange ?? 0;
    const qalys = healthMetrics.find(m => m.metricId.includes('qaly'))?.absoluteChange ?? 0;
    const savings = economicOutcomes.find(o => o.metricId.includes('savings'))?.absoluteChange ?? 0;

    return {
      incrementalCostEffectivenessRatio: qalys !== 0 ? costs / qalys : Infinity,
      numberNeededToTreat: 100 / (healthMetrics[0]?.relativeChange ?? 100),
      returnOnInvestment: costs !== 0 ? (savings / costs - 1) * 100 : 0,
      paybackPeriod: savings !== 0 ? costs / savings : Infinity
    };
  }

  /**
   * Calculate budget impact analysis
   */
  private calculateBudgetImpact(
    economicOutcomes: EconomicOutcomeResult[],
    populationSize: number
  ): BudgetImpactAnalysis {
    const yearlyImpact = Array.from({ length: 5 }, (_, i) => ({
      year: i + 1,
      populationCovered: populationSize,
      interventionCost: this.getYearlyCost(economicOutcomes, i + 1),
      costSavings: this.getYearlySavings(economicOutcomes, i + 1),
      netBudgetImpact: 0 // Will be calculated below
    }));

    // Calculate net impact for each year
    yearlyImpact.forEach(year => {
      year.netBudgetImpact = year.costSavings - year.interventionCost;
    });

    return {
      yearByYearImpact: yearlyImpact,
      fiveYearTotalImpact: yearlyImpact.reduce((sum, year) => sum + year.netBudgetImpact, 0)
    };
  }

  /**
   * Calculate Medicare-specific impact metrics
   */
  private calculateMedicareImpact(
    economicOutcomes: EconomicOutcomeResult[],
    populationSize: number
  ): MedicareImpactAnalysis {
    const medicareEligiblePct = 0.18; // 18% of population Medicare-eligible
    const medicarePopulation = populationSize * medicareEligiblePct;
    
    const totalSavings = economicOutcomes
      .filter(o => o.metricId.includes('medicare'))
      .reduce((sum, o) => sum + o.absoluteChange, 0);
    
    const perBeneficiarySavings = medicarePopulation > 0 ? totalSavings / medicarePopulation : 0;
    
    return {
      perBeneficiarySavings,
      fiveYearProgramSavings: totalSavings * 5, // Simple 5-year projection
      trustFundImpactStatement: this.generateTrustFundStatement(totalSavings)
    };
  }

  /**
   * Helper method to collect all parameters from an intervention
   */
  private collectAllParameters(intervention: Intervention): Parameter[] {
    const parameters: Parameter[] = [];
    
    intervention.primaryOutcomes.forEach(primary => {
      primary.secondaryOutcomes.forEach(secondary => {
        parameters.push(...secondary.parameters);
      });
    });
    
    return parameters;
  }

  /**
   * Helper method to check if a secondary outcome is economic
   */
  private isEconomicOutcome(outcome: SecondaryOutcome): boolean {
    return outcome.unit?.includes('$') ?? false;
  }

  /**
   * Helper method to evaluate equation strings
   */
  private evaluateEquation(
    equation: string,
    parameters: Record<string, number>,
    populationSize: number
  ): number {
    return this.equationParser.evaluate(equation, {
      parameters,
      population: populationSize
    });
  }

  /**
   * Helper method to calculate yearly costs
   */
  private getYearlyCost(outcomes: EconomicOutcomeResult[], year: number): number {
    const costs = outcomes.filter(o => o.metricId.includes('cost'));
    return costs.reduce((sum, cost) => sum + cost.absoluteChange, 0) / year; // Simple decay
  }

  /**
   * Helper method to calculate yearly savings
   */
  private getYearlySavings(outcomes: EconomicOutcomeResult[], year: number): number {
    const savings = outcomes.filter(o => o.metricId.includes('savings'));
    return savings.reduce((sum, saving) => sum + saving.absoluteChange, 0) * year; // Simple growth
  }

  /**
   * Helper method to generate Medicare trust fund impact statement
   */
  private generateTrustFundStatement(totalSavings: number): string {
    const months = Math.round((totalSavings / 1e9) * 2); // Rough estimate: $1B = 2 months
    return `Would extend Medicare Trust Fund solvency by approximately ${months} months based on current projections.`;
  }
} 