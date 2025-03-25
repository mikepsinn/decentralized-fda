import {
  BudgetImpactAnalysis,
  EconomicOutcomeResult,
  YearlyBudgetImpact,
} from "./types";
import { FormatUtils } from "./format-utils";

/**
 * Budget impact analysis module
 */
export class BudgetImpactAnalyzer {
  /**
   * Calculate budget impact over time
   */
  public calculateBudgetImpact(
    costs: EconomicOutcomeResult[],
    populationSize: number,
    options: {
      timeHorizon?: number;
      discountRate?: number;
      populationGrowthRate?: number;
      uptakeRates?: number[];
    } = {},
  ): BudgetImpactAnalysis {
    const {
      timeHorizon = 5,
      discountRate = 3,
      populationGrowthRate = 1,
      uptakeRates = this.generateDefaultUptakeRates(timeHorizon),
    } = options;

    const yearlyImpact: YearlyBudgetImpact[] = [];
    let cumulativePopulation = populationSize;

    for (let year = 1; year <= timeHorizon; year++) {
      const discountFactor = Math.pow(1 - discountRate / 100, year - 1);
      const uptakeRate = uptakeRates[year - 1];
      const populationCovered = cumulativePopulation * (uptakeRate / 100);

      const interventionCost = this.calculateYearlyCosts(
        costs,
        year,
        discountFactor,
        populationCovered,
      );
      const costSavings = this.calculateYearlySavings(
        costs,
        year,
        discountFactor,
        populationCovered,
      );
      const netBudgetImpact = costSavings - interventionCost;

      yearlyImpact.push({
        year,
        populationCovered,
        interventionCost,
        costSavings,
        netBudgetImpact,
      });

      // Update population for next year
      cumulativePopulation *= 1 + populationGrowthRate / 100;
    }

    return {
      yearByYearImpact: yearlyImpact,
      fiveYearTotalImpact: this.calculateTotalImpact(yearlyImpact),
    };
  }

  /**
   * Calculate yearly intervention costs
   */
  private calculateYearlyCosts(
    costs: EconomicOutcomeResult[],
    year: number,
    discountFactor: number,
    populationCovered: number,
  ): number {
    const interventionCosts = costs
      .filter((c) => c.metricId.toLowerCase().includes("cost"))
      .reduce((sum, c) => sum + c.absoluteChange, 0);

    // Assume costs decrease over time due to efficiency gains
    const efficiencyFactor = Math.pow(0.95, year - 1); // 5% efficiency gain per year

    return (
      interventionCosts *
      discountFactor *
      efficiencyFactor *
      (populationCovered / costs[0]?.populationSize ?? 1)
    );
  }

  /**
   * Calculate yearly cost savings
   */
  private calculateYearlySavings(
    costs: EconomicOutcomeResult[],
    year: number,
    discountFactor: number,
    populationCovered: number,
  ): number {
    const annualSavings = costs
      .filter((c) => c.metricId.toLowerCase().includes("savings"))
      .reduce((sum, c) => sum + c.absoluteChange, 0);

    // Assume savings increase over time as the intervention becomes more effective
    const effectivenessFactor = Math.min(1.5, Math.pow(1.1, year - 1)); // Max 50% increase

    return (
      annualSavings *
      discountFactor *
      effectivenessFactor *
      (populationCovered / costs[0]?.populationSize ?? 1)
    );
  }

  /**
   * Calculate total budget impact over the analysis period
   */
  private calculateTotalImpact(yearlyImpact: YearlyBudgetImpact[]): number {
    return yearlyImpact.reduce((sum, year) => sum + year.netBudgetImpact, 0);
  }

  /**
   * Generate default uptake rates that follow an S-curve adoption pattern
   */
  private generateDefaultUptakeRates(timeHorizon: number): number[] {
    return Array.from({ length: timeHorizon }, (_, i) => {
      // S-curve formula: 100 / (1 + e^(-k * (x - midpoint)))
      const k = 1.5; // Steepness
      const midpoint = (timeHorizon - 1) / 2;
      const x = i;
      return 100 / (1 + Math.exp(-k * (x - midpoint)));
    });
  }

  /**
   * Evaluate budget impact based on thresholds
   */
  public evaluateBudgetImpact(
    analysis: BudgetImpactAnalysis,
    thresholds: {
      lowImpact: number;
      moderateImpact: number;
      highImpact: number;
    },
  ): {
    assessment: "low" | "moderate" | "high";
    explanation: string;
  } {
    const averageAnnualImpact = Math.abs(analysis.fiveYearTotalImpact / 5);

    if (averageAnnualImpact <= thresholds.lowImpact) {
      return {
        assessment: "low",
        explanation: `Average annual budget impact of ${FormatUtils.formatCurrency(averageAnnualImpact)} is below the low impact threshold of ${FormatUtils.formatCurrency(thresholds.lowImpact)}`,
      };
    }

    if (averageAnnualImpact <= thresholds.moderateImpact) {
      return {
        assessment: "moderate",
        explanation: `Average annual budget impact of ${FormatUtils.formatCurrency(averageAnnualImpact)} indicates moderate budgetary implications`,
      };
    }

    return {
      assessment: "high",
      explanation: `Average annual budget impact of ${FormatUtils.formatCurrency(averageAnnualImpact)} exceeds the moderate impact threshold of ${FormatUtils.formatCurrency(thresholds.moderateImpact)}`,
    };
  }

  /**
   * Generate a summary report of budget impact analysis
   */
  public generateSummaryReport(
    analysis: BudgetImpactAnalysis,
    thresholds: {
      lowImpact: number;
      moderateImpact: number;
      highImpact: number;
    },
  ): string {
    const evaluation = this.evaluateBudgetImpact(analysis, thresholds);
    const { yearByYearImpact, fiveYearTotalImpact } = analysis;

    const yearlyReports = yearByYearImpact.map((year) =>
      [
        `Year ${year.year}:`,
        `  - Population Covered: ${FormatUtils.formatWithUnits(year.populationCovered, "people")}`,
        `  - Intervention Cost: ${FormatUtils.formatCurrency(year.interventionCost)}`,
        `  - Cost Savings: ${FormatUtils.formatCurrency(year.costSavings)}`,
        `  - Net Impact: ${FormatUtils.formatCurrency(year.netBudgetImpact)}`,
      ].join("\n"),
    );

    return [
      `Budget Impact Analysis Summary:`,
      `- Assessment: ${evaluation.assessment.toUpperCase()} IMPACT`,
      `- ${evaluation.explanation}`,
      ``,
      `Yearly Breakdown:`,
      ...yearlyReports,
      ``,
      `Five-Year Total Impact: ${FormatUtils.formatCurrency(fiveYearTotalImpact)}`,
      `Average Annual Impact: ${FormatUtils.formatCurrency(fiveYearTotalImpact / 5)}`,
      ``,
      `This intervention has a ${evaluation.assessment} impact on the budget.`,
    ].join("\n");
  }
}
