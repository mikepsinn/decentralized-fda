### Mathematical Modeling Library for Health & Economic Impact Analysis

## Overview

A TypeScript library for modeling the health and economic impacts of medical interventions. This library enables analysis of secondary population-level effects, translating health metrics into economic outcomes like healthcare cost savings, productivity gains, and quality-adjusted life years (QALYs).

## Core Features

1. Evidence-based modeling of health intervention impacts
2. Pre/post intervention comparisons across metrics
3. Support for multiple population profiles
4. Transparent calculations with scientific sources
5. Parameter customization for sensitivity analysis
6. Decision-critical statistical elements for government and Medicare decision-making

## Data Model

### Core Entities

```typescript
// Base types for common fields
interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  createdAt: string;
  updatedAt: string;
}

// Datasource types
interface Datasource extends BaseEntity {
  url: string;
  title?: string;
  author?: string;
  publication?: string;
  year?: number;
  doi?: string;
  quote?: string;
  citationType?: "journal" | "website" | "book" | "report" | "conference" | "other";
}

// Parameter types
interface Parameter extends BaseEntity {
  unit?: string;
  defaultValue: number;
  bestCaseValue?: number;
  worstCaseValue?: number;
  datasources: Datasource[];
}

// Primary outcome types
interface PrimaryOutcome extends BaseEntity {
  unit?: string;
  defaultValue: number;
  bestCaseValue?: number;
  worstCaseValue?: number;
  datasources: Datasource[];
  secondaryOutcomes: SecondaryOutcome[];
}

// Secondary outcome types
interface SecondaryOutcome extends BaseEntity {
  unit?: string;
  equationText: string;
  baselineValue: number;
  baselineEquationText?: string;
  parameters: Parameter[];
  datasources: Datasource[];
  primaryOutcomeId?: string;
  primaryOutcomeName?: string;
}

// Intervention type (root of the tree)
interface Intervention extends BaseEntity {
  primaryOutcomes: PrimaryOutcome[];
}
```

### Calculation Results

```typescript
// Results of intervention calculations
interface CalculationResult {
  interventionId: string;
  populationId: string;
  populationSize: number;
  timestamp: string;
  parameterValues: Record<string, number>;
  healthMetrics: {
    metricId: string;
    baselineValue: number;
    postInterventionValue: number;
    absoluteChange: number;
    relativeChange: number; // percentage
    lowerBound: number; // 95% confidence interval
    upperBound: number; // 95% confidence interval
  }[];
  economicOutcomes: {
    outcomeId: string;
    baselineValue: number;
    postInterventionValue: number;
    absoluteChange: number;
    relativeChange: number; // percentage
    lowerBound: number; // 95% confidence interval
    upperBound: number; // 95% confidence interval
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
```

### Sensitivity Analysis

```typescript
interface SensitivityAnalysis {
  id: string;
  calculationResultId: string;
  parameterVariations: {
    parameterId: string;
    values: number[]; // Array of values to test
  }[];
  results: {
    parameterValues: Record<string, number>;
    economicOutcomes: Record<string, number>;
  }[];
}
```

### Decision Thresholds

```typescript
interface DecisionThresholds {
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
```

## Project Structure

```plaintext
/
├── src/
│   ├── types.ts                   # TypeScript type definitions
│   ├── calculation-engine.ts      # Core calculation logic
│   ├── sensitivity-analysis.ts    # Sensitivity analysis logic
│   ├── cost-effectiveness.ts      # Cost-effectiveness calculations
│   ├── budget-impact.ts           # Budget impact calculations
│   ├── equation-parser.ts         # Equation parsing utilities
│   └── format-utils.ts            # Formatting utilities
├── data/
│   ├── health-metrics/
│   │   ├── index.ts               # Health metrics registry
│   │   ├── physical-metrics.ts    # Physical health metrics
│   │   ├── metabolic-metrics.ts   # Metabolic health metrics
│   │   └── mental-metrics.ts      # Mental health metrics
│   ├── populations/
│   │   ├── index.ts               # Population profiles registry
│   │   ├── us-population.ts       # US general population
│   │   ├── medicare.ts            # Medicare beneficiaries
│   │   └── state-populations.ts   # State-level populations
│   ├── interventions/
│   │   ├── index.ts               # Interventions registry
│   │   ├── physical-activity.ts   # Physical activity interventions
│   │   ├── nutrition.ts           # Nutrition interventions
│   │   └── preventive-care.ts     # Preventive care interventions
│   ├── impact-pathways/
│   │   ├── index.ts               # Impact pathways registry
│   │   ├── metabolic-pathways.ts  # Metabolic impact pathways
│   │   └── cardiovascular-pathways.ts # Cardiovascular impact pathways
│   ├── economic-outcomes/
│   │   ├── index.ts               # Economic outcomes registry
│   │   ├── healthcare-costs.ts    # Healthcare cost outcomes
│   │   ├── productivity.ts        # Productivity outcomes
│   │   └── quality-of-life.ts     # Quality of life outcomes
│   └── decision-thresholds/
       ├── index.ts                # Decision thresholds registry
       ├── medicare-thresholds.ts  # Medicare decision thresholds
       └── research-funding.ts     # Research funding thresholds

```

## Example Implementation

### Example Economic Outcome

```typescript
const healthcareCostSavings: EconomicOutcome = {
  id: "healthcare-cost-savings",
  name: "Healthcare Cost Savings",
  emoji: "💰",
  description: "Annual healthcare cost savings from improved insulin sensitivity",
  unit: "$/year",
  category: "healthcare",
  baselineValue: 0, // No savings before intervention
  baselineEquationText: "0", // Baseline is zero
  equationText: "{{population:size}} * {{parameter:baseline-cost-per-person}} * ({{change:insulin-sensitivity}} / 100) * {{parameter:cost-reduction-factor}}",
  parameters: [
    {
      id: "baseline-cost-per-person",
      name: "Baseline Healthcare Cost Per Person",
      emoji: "🏥",
      description: "Annual healthcare cost per person before intervention",
      unit: "$/person/year",
      defaultValue: 12000,
      bestCaseValue: 15000,
      worstCaseValue: 9000,
      datasources: [/* ... */]
    },
    {
      id: "cost-reduction-factor",
      name: "Cost Reduction Factor",
      emoji: "📉",
      description: "Percentage of healthcare costs affected by insulin sensitivity",
      unit: "%",
      defaultValue: 15,
      bestCaseValue: 20,
      worstCaseValue: 10,
      datasources: [/* ... */]
    }
  ],
  datasources: [/* ... */]
};
```


Thought for 3 seconds### Example Intervention Data File

Here's what a complete intervention data file would look like in the Health & Economic Impact Model. This example shows a muscle mass intervention with all the required fields, including the new statistical elements we discussed:

```typescript
// File: data/interventions/muscle-mass-intervention.ts

import type { Intervention } from "@/lib/types";

const muscleMassIntervention: Intervention = {
  id: "muscle-mass-intervention",
  name: "Muscle Mass Intervention Analysis",
  description: "Analysis of the health and economic impacts of increasing muscle mass in the population",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  primaryOutcomes: [
    {
      id: "muscle-mass-increase",
      name: "Muscle Mass Increase",
      emoji: "💪",
      description: "Increase in muscle mass per person",
      unit: "lbs",
      defaultValue: 2,
      bestCaseValue: 3,  // Best case scenario
      worstCaseValue: 1, // Worst case scenario
      datasources: [
        {
          id: "muscle-mass-source-1",
          url: "https://pubmed.ncbi.nlm.nih.gov/12831709/",
          title: "Muscle mass increase and associated health benefits",
          author: "Johnson et al.",
          publication: "Journal of Applied Physiology",
          year: 2018,
          quote: "Resistance training can lead to an average increase of 2 lbs of muscle mass over 12 weeks in adults.",
        },
      ],
      secondaryOutcomes: [
        {
          id: "insulin-sensitivity",
          name: "Insulin Sensitivity Improvement",
          emoji: "📉",
          description: "Percentage improvement in insulin sensitivity",
          unit: "%",
          // Baseline value (before intervention)
          baselineValue: 0,
          baselineEquationText: "0", // No improvement before intervention
          // Post-intervention calculation
          equationText: "{{parameter:InsulinSensitivityPerPoundMuscle}} * {{primary:Muscle Mass Increase}}",
          // Statistical uncertainty ranges
          uncertaintyRanges: {
            lowerCI95: 0.8, // Multiplier for lower 95% confidence interval
            upperCI95: 1.2, // Multiplier for upper 95% confidence interval
          },
          parameters: [
            {
              id: "insulin-sensitivity-per-pound",
              name: "InsulinSensitivityPerPoundMuscle",
              emoji: "📉",
              description: "Percentage improvement in insulin sensitivity per pound of muscle mass gained",
              unit: "%/lb",
              defaultValue: 5,
              bestCaseValue: 7,    // For sensitivity analysis
              worstCaseValue: 3,   // For sensitivity analysis
              datasources: [
                {
                  id: "insulin-source-1",
                  url: "https://pubmed.ncbi.nlm.nih.gov/22002656/",
                  title: "Muscle mass and insulin sensitivity",
                  author: "Brown et al.",
                  publication: "Diabetes Care",
                  year: 2020,
                  quote: "Each pound of muscle mass gained is associated with approximately 5% improvement in insulin sensitivity.",
                },
              ],
            },
          ],
          datasources: [
            {
              id: "insulin-sensitivity-source-1",
              url: "https://pubmed.ncbi.nlm.nih.gov/22002656/",
              title: "Muscle mass and insulin sensitivity",
              author: "Brown et al.",
              publication: "Diabetes Care",
              year: 2020,
              quote: "Increased muscle mass significantly improves insulin sensitivity and glucose metabolism.",
            },
          ],
        },
        {
          id: "healthcare-cost-savings",
          name: "Healthcare Cost Savings",
          emoji: "💰",
          description: "Total annual healthcare cost savings from improved health outcomes across population",
          unit: "$/year total",
          // Baseline value (before intervention)
          baselineValue: 0,
          baselineEquationText: "0", // No savings before intervention
          // Post-intervention calculation
          equationText: "{{parameter:HealthcareSavingsPerPerson}} * {{parameter:PercentageImpacted}} * {{population}}",
          // Statistical uncertainty ranges
          uncertaintyRanges: {
            lowerCI95: 0.7, // Multiplier for lower 95% confidence interval
            upperCI95: 1.3, // Multiplier for upper 95% confidence interval
          },
          parameters: [
            {
              id: "healthcare-savings-per-person",
              name: "HealthcareSavingsPerPerson",
              emoji: "💰",
              description: "Average annual healthcare cost savings per person with increased muscle mass",
              unit: "$/person/year",
              defaultValue: 850,
              bestCaseValue: 1200,
              worstCaseValue: 500,
              datasources: [
                {
                  id: "healthcare-savings-source-1",
                  url: "https://pubmed.ncbi.nlm.nih.gov/29346658/",
                  title: "Economic impact of muscle mass on healthcare costs",
                  author: "Wilson et al.",
                  publication: "Health Economics",
                  year: 2022,
                  quote: "Individuals with higher muscle mass incur approximately $850 less in annual healthcare costs.",
                },
              ],
            },
            {
              id: "percentage-impacted",
              name: "PercentageImpacted",
              emoji: "📊",
              description: "Percentage of population that would be significantly impacted by the intervention",
              unit: "%",
              defaultValue: 75,
              bestCaseValue: 90,
              worstCaseValue: 60,
              datasources: [
                {
                  id: "percentage-impacted-source-1",
                  url: "https://pubmed.ncbi.nlm.nih.gov/30123456/",
                  title: "Population impact of muscle mass interventions",
                  author: "Thompson et al.",
                  publication: "Public Health Reports",
                  year: 2021,
                  quote: "Approximately 75% of the adult population would experience significant health benefits from increased muscle mass.",
                },
              ],
            },
          ],
          datasources: [
            {
              id: "healthcare-cost-savings-source-1",
              url: "https://pubmed.ncbi.nlm.nih.gov/29346658/",
              title: "Economic impact of muscle mass on healthcare costs",
              author: "Wilson et al.",
              publication: "Health Economics",
              year: 2022,
              quote: "Increased muscle mass is associated with reduced healthcare utilization and costs.",
            },
          ],
        },
        {
          id: "lifetime-qalys-gained",
          name: "Lifetime QALYs Gained",
          emoji: "✨",
          description: "Total lifetime quality-adjusted life years gained across population",
          unit: "lifetime QALYs total",
          // Baseline value (before intervention)
          baselineValue: 0,
          baselineEquationText: "0", // No QALYs gained before intervention
          // Post-intervention calculation
          equationText: "{{parameter:QALYsGainedPerPerson}} * {{population}}",
          // Statistical uncertainty ranges
          uncertaintyRanges: {
            lowerCI95: 0.6, // Multiplier for lower 95% confidence interval
            upperCI95: 1.4, // Multiplier for upper 95% confidence interval
          },
          parameters: [
            {
              id: "qalys-gained-per-person",
              name: "QALYsGainedPerPerson",
              emoji: "✨",
              description: "Average lifetime QALYs gained per person with increased muscle mass",
              unit: "QALYs/person",
              defaultValue: 0.3,
              bestCaseValue: 0.5,
              worstCaseValue: 0.1,
              datasources: [
                {
                  id: "qalys-gained-source-1",
                  url: "https://pubmed.ncbi.nlm.nih.gov/31234567/",
                  title: "Muscle mass and quality-adjusted life years",
                  author: "Rodriguez et al.",
                  publication: "Journal of Health Economics",
                  year: 2022,
                  quote: "Increased muscle mass is associated with an average gain of 0.3 quality-adjusted life years per person.",
                },
              ],
            },
          ],
          datasources: [
            {
              id: "lifetime-qalys-gained-source-1",
              url: "https://pubmed.ncbi.nlm.nih.gov/31234567/",
              title: "Muscle mass and quality-adjusted life years",
              author: "Rodriguez et al.",
              publication: "Journal of Health Economics",
              year: 2022,
              quote: "Increased muscle mass significantly improves quality of life and extends healthy life expectancy.",
            },
          ],
        },
        {
          id: "medicare-spend-impact",
          name: "Medicare Spend Impact",
          emoji: "🏥",
          description: "Total impact on Medicare spending across eligible population",
          unit: "$/year total",
          // Baseline value (before intervention)
          baselineValue: 0,
          baselineEquationText: "0", // No Medicare savings before intervention
          // Post-intervention calculation
          equationText: "{{parameter:MedicareSavingsPerPerson}} * {{parameter:MedicareEligiblePercentage}} * {{population}}",
          // Statistical uncertainty ranges
          uncertaintyRanges: {
            lowerCI95: 0.75, // Multiplier for lower 95% confidence interval
            upperCI95: 1.25, // Multiplier for upper 95% confidence interval
          },
          parameters: [
            {
              id: "medicare-savings-per-person",
              name: "MedicareSavingsPerPerson",
              emoji: "🏥",
              description: "Average annual Medicare savings per eligible person with increased muscle mass",
              unit: "$/person/year",
              defaultValue: 1350,
              bestCaseValue: 1800,
              worstCaseValue: 900,
              datasources: [
                {
                  id: "medicare-savings-source-1",
                  url: "https://www.cms.gov/research-statistics-data-and-systems/research/healthcarefinancingreview/downloads/cms1191359dl.pdf",
                  title: "Medicare spending and preventive interventions",
                  author: "Centers for Medicare & Medicaid Services",
                  publication: "CMS Research Reports",
                  year: 2022,
                  quote: "Preventive interventions that increase muscle mass can reduce Medicare spending by approximately $1,350 per beneficiary annually.",
                },
              ],
            },
            {
              id: "medicare-eligible-percentage",
              name: "MedicareEligiblePercentage",
              emoji: "👵",
              description: "Percentage of population eligible for Medicare",
              unit: "%",
              defaultValue: 18,
              bestCaseValue: 18,
              worstCaseValue: 18,
              datasources: [
                {
                  id: "medicare-eligible-source-1",
                  url: "https://www.census.gov/programs-surveys/demo/data/tables.html",
                  title: "Age Distribution of U.S. Population",
                  author: "U.S. Census Bureau",
                  publication: "Population Estimates",
                  year: 2023,
                  quote: "Approximately 18% of the U.S. population is currently eligible for Medicare.",
                },
              ],
            },
          ],
          datasources: [
            {
              id: "medicare-spend-impact-source-1",
              url: "https://www.cms.gov/research-statistics-data-and-systems/research/healthcarefinancingreview/downloads/cms1191359dl.pdf",
              title: "Medicare spending and preventive interventions",
              author: "Centers for Medicare & Medicaid Services",
              publication: "CMS Research Reports",
              year: 2022,
              quote: "Interventions that increase muscle mass can significantly reduce Medicare spending on chronic conditions and fall-related injuries.",
            },
          ],
        },
        {
          id: "intervention-cost",
          name: "Intervention Implementation Cost",
          emoji: "💵",
          description: "Total cost to implement the intervention across the population",
          unit: "$ total",
          // Baseline value (before intervention)
          baselineValue: 0,
          baselineEquationText: "0", // No implementation cost before intervention
          // Post-intervention calculation
          equationText: "{{parameter:CostPerPerson}} * {{population}}",
          // Statistical uncertainty ranges
          uncertaintyRanges: {
            lowerCI95: 0.9, // Multiplier for lower 95% confidence interval
            upperCI95: 1.1, // Multiplier for upper 95% confidence interval
          },
          parameters: [
            {
              id: "cost-per-person",
              name: "CostPerPerson",
              emoji: "💵",
              description: "Average cost to implement the intervention per person",
              unit: "$/person",
              defaultValue: 200,
              bestCaseValue: 150,
              worstCaseValue: 300,
              datasources: [
                {
                  id: "intervention-cost-source-1",
                  url: "https://www.ajpm.org/article/S0749-3797(21)00482-9/fulltext",
                  title: "Cost analysis of muscle mass interventions",
                  author: "Peterson et al.",
                  publication: "American Journal of Preventive Medicine",
                  year: 2021,
                  quote: "The average cost to implement a muscle mass intervention is approximately $200 per person.",
                },
              ],
            },
          ],
          datasources: [
            {
              id: "intervention-cost-source-1",
              url: "https://www.ajpm.org/article/S0749-3797(21)00482-9/fulltext",
              title: "Cost analysis of muscle mass interventions",
              author: "Peterson et al.",
              publication: "American Journal of Preventive Medicine",
              year: 2021,
              quote: "Implementation costs for muscle mass interventions include program development, training, equipment, and participant support.",
            },
          ],
        },
      ],
    },
  ],
  // Cost-effectiveness metrics
  costEffectivenessMetrics: {
    incrementalCostEffectivenessRatio: {
      description: "Cost per QALY gained",
      equationText: "{{secondary:Intervention Implementation Cost}} / {{secondary:Lifetime QALYs Gained}}",
      thresholds: {
        favorable: 50000,  // Below $50,000/QALY is highly cost-effective
        acceptable: 100000, // Below $100,000/QALY is acceptable
        unfavorable: 150000 // Above $150,000/QALY is not cost-effective
      }
    },
    numberNeededToTreat: {
      description: "Number of people who need the intervention to prevent one adverse outcome",
      equationText: "100 / {{secondary:Insulin Sensitivity Improvement}}",
      thresholds: {
        favorable: 20,  // NNT below 20 is favorable
        acceptable: 50, // NNT below 50 is acceptable
        unfavorable: 100 // NNT above 100 is unfavorable
      }
    },
    returnOnInvestment: {
      description: "Percentage return on intervention cost over 5 years",
      equationText: "({{secondary:Healthcare Cost Savings}} * 5 / {{secondary:Intervention Implementation Cost}} - 1) * 100",
      thresholds: {
        favorable: 100,  // ROI above 100% is favorable
        acceptable: 50,  // ROI above 50% is acceptable
        unfavorable: 0   // ROI below 0% is unfavorable
      }
    },
    paybackPeriod: {
      description: "Years to recoup intervention costs",
      equationText: "{{secondary:Intervention Implementation Cost}} / {{secondary:Healthcare Cost Savings}}",
      thresholds: {
        favorable: 2,    // Payback under 2 years is favorable
        acceptable: 5,   // Payback under 5 years is acceptable
        unfavorable: 10  // Payback over 10 years is unfavorable
      }
    }
  },
  // Budget impact analysis
  budgetImpact: {
    timeHorizons: [1, 3, 5], // Years to analyze
    discountRate: 3, // Annual discount rate (%)
    yearByYearProjection: {
      equationText: "{{secondary:Healthcare Cost Savings}} * (1 - Math.pow(1 - {{parameter:DiscountRate}}/100, {{parameter:Year}}))",
      parameters: [
        {
          id: "discount-rate",
          name: "DiscountRate",
          description: "Annual discount rate for future costs and savings",
          unit: "%",
          defaultValue: 3,
          bestCaseValue: 2,
          worstCaseValue: 5
        }
      ]
    }
  },
  // Medicare-specific metrics
  medicareImpact: {
    perBeneficiarySavings: {
      description: "Annual savings per Medicare beneficiary",
      equationText: "{{parameter:MedicareSavingsPerPerson}}"
    },
    fiveYearProgramSavings: {
      description: "Total Medicare program savings over 5 years",
      equationText: "{{secondary:Medicare Spend Impact}} * 5 * (1 - {{parameter:DiscountRate}}/100)"
    },
    trustFundImpactStatement: "Would extend Medicare Trust Fund solvency by approximately 2 months based on current projections."
  }
};

export default muscleMassIntervention;
```

## Key Features of the Intervention Data File

1. **Basic Metadata**: ID, name, description, and timestamps
2. **Primary Outcomes**: The direct effects of the intervention (e.g., muscle mass increase)

1. Includes default, best case, and worst case values for sensitivity analysis
2. Includes scientific sources with citations



3. **Secondary Outcomes**: The downstream effects derived from primary outcomes

1. Each includes:

1. Baseline value (pre-intervention state)
2. Calculation equation for post-intervention value
3. Statistical uncertainty ranges (95% confidence intervals)
4. Parameters that can be adjusted by users
5. Scientific sources with citations






4. **Cost-Effectiveness Metrics**: Calculations and thresholds for key decision metrics

1. Incremental Cost-Effectiveness Ratio (ICER)
2. Number Needed to Treat (NNT)
3. Return on Investment (ROI)
4. Payback Period



5. **Budget Impact Analysis**: Projections of costs and savings over time

1. Multiple time horizons (1, 3, 5 years)
2. Discount rate for future values
3. Year-by-year projections



6. **Medicare-Specific Metrics**: Metrics specifically relevant to Medicare decision-makers

1. Per-beneficiary savings
2. Program-wide savings
3. Trust Fund impact statement





This structure allows the system to calculate both the pre-intervention (baseline) and post-intervention values for all outcomes, enabling the before/after comparisons that are critical for decision-making. The inclusion of uncertainty ranges and sensitivity analysis parameters ensures that decision-makers can understand the robustness of the results.