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
  citationType?:
    | "journal"
    | "website"
    | "book"
    | "report"
    | "conference"
    | "other";
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
  primaryOutcomes: {
    id: string;
    baselineValue: number;
    postInterventionValue: number;
    absoluteChange: number;
    relativeChange: number; // percentage
    lowerBound: number; // 95% confidence interval
    upperBound: number; // 95% confidence interval
  }[];
  secondaryHealthOutcomes: {
    id: string;
    baselineValue: number;
    postInterventionValue: number;
    absoluteChange: number;
    relativeChange: number; // percentage
    lowerBound: number; // 95% confidence interval
    upperBound: number; // 95% confidence interval
    primaryOutcomeId: string; // Links back to primary outcome that caused this effect
  }[];
  secondaryEconomicOutcomes: {
    id: string;
    baselineValue: number;
    postInterventionValue: number;
    absoluteChange: number;
    relativeChange: number; // percentage
    lowerBound: number; // 95% confidence interval
    upperBound: number; // 95% confidence interval
    primaryOutcomeId: string; // Links back to primary outcome that caused this effect
  }[];
  totalEconomicImpact: {
    baselineValue: number;
    postInterventionValue: number;
    absoluteChange: number;
    relativeChange: number; // percentage
    lowerBound: number; // 95% confidence interval
    upperBound: number; // 95% confidence interval
  };
  costEffectivenessMetrics: {
    incrementalCostEffectivenessRatio: number; // $ per QALY gained
    numberNeededToTreat: number; // Number of people who need the intervention to prevent one adverse outcome
    returnOnInvestment: number; // Percentage return on intervention cost
    paybackPeriod: number; // Years to recoup intervention costs
  };
  budgetImpact: {
    yearByYearImpact: {
      year: number;
      populationCovered: number;
      interventionCost: number;
      costSavings: number;
      netBudgetImpact: number;
    }[];
    fiveYearTotalImpact: number;
  };
  medicareImpact?: {
    perBeneficiarySavings: number;
    fiveYearProgramSavings: number;
    trustFundImpactStatement: string;
  };
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
  costEffectivenessThresholds: {
    favorable: number; // e.g., $50,000/QALY
    acceptable: number; // e.g., $100,000/QALY
    unfavorable: number; // e.g., $150,000/QALY
  };
  budgetImpactThresholds: {
    lowImpact: number; // e.g., <$10M/year
    moderateImpact: number; // e.g., $10M-$50M/year
    highImpact: number; // e.g., >$50M/year
  };
}
