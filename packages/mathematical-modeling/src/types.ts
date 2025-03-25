/**
 * Core data models for the health & economic impact analysis library
 */

// Base entity type for common fields
export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  createdAt: string;
  updatedAt: string;
}

// Scientific data source
export interface Datasource extends BaseEntity {
  url: string;
  title?: string;
  author?: string;
  publication?: string;
  year?: number;
  doi?: string;
  quote?: string;
  citationType?: "journal" | "website" | "book" | "report" | "conference" | "other";
}

// Configurable parameter with uncertainty ranges
export interface Parameter extends BaseEntity {
  unit?: string;
  defaultValue: number;
  bestCaseValue?: number;
  worstCaseValue?: number;
  datasources: Datasource[];
}

// Direct intervention outcome
export interface PrimaryOutcome extends BaseEntity {
  unit?: string;
  defaultValue: number;
  bestCaseValue?: number;
  worstCaseValue?: number;
  datasources: Datasource[];
  secondaryOutcomes: SecondaryOutcome[];
}

// Derived outcome from primary effects
export interface SecondaryOutcome extends BaseEntity {
  unit?: string;
  equationText: string;
  baselineValue: number;
  baselineEquationText?: string;
  parameters: Parameter[];
  datasources: Datasource[];
  primaryOutcomeId?: string;
  primaryOutcomeName?: string;
}

// Root intervention type
export interface Intervention extends BaseEntity {
  primaryOutcomes: PrimaryOutcome[];
}

// Results of intervention calculations
export interface CalculationResult {
  interventionId: string;
  populationId: string;
  populationSize: number;
  timestamp: string;
  parameterValues: Record<string, number>;
  healthMetrics: HealthMetricResult[];
  economicOutcomes: EconomicOutcomeResult[];
  totalEconomicImpact: EconomicImpactResult;
  costEffectivenessMetrics: CostEffectivenessMetrics;
  budgetImpact: BudgetImpactAnalysis;
  medicareImpact?: MedicareImpactAnalysis;
}

interface BaseMetricResult {
  metricId: string;
  baselineValue: number;
  postInterventionValue: number;
  absoluteChange: number;
  relativeChange: number;
  lowerBound: number;
  upperBound: number;
}

export interface HealthMetricResult extends BaseMetricResult {}
export interface EconomicOutcomeResult extends BaseMetricResult {}
export interface EconomicImpactResult extends BaseMetricResult {}

export interface CostEffectivenessMetrics {
  incrementalCostEffectivenessRatio: number;
  numberNeededToTreat: number;
  returnOnInvestment: number;
  paybackPeriod: number;
}

export interface BudgetImpactAnalysis {
  yearByYearImpact: YearlyBudgetImpact[];
  fiveYearTotalImpact: number;
}

export interface YearlyBudgetImpact {
  year: number;
  populationCovered: number;
  interventionCost: number;
  costSavings: number;
  netBudgetImpact: number;
}

export interface MedicareImpactAnalysis {
  perBeneficiarySavings: number;
  fiveYearProgramSavings: number;
  trustFundImpactStatement: string;
}

// Sensitivity analysis types
export interface SensitivityAnalysis {
  id: string;
  calculationResultId: string;
  parameterVariations: ParameterVariation[];
  results: SensitivityResult[];
}

export interface ParameterVariation {
  parameterId: string;
  values: number[];
}

export interface SensitivityResult {
  parameterValues: Record<string, number>;
  economicOutcomes: Record<string, number>;
}

// Decision threshold types
export interface DecisionThresholds {
  costEffectivenessThresholds: ThresholdLevels;
  budgetImpactThresholds: ThresholdLevels;
}

export interface ThresholdLevels {
  favorable: number;
  acceptable: number;
  unfavorable: number;
} 