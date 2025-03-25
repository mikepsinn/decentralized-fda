import {
  CostEffectivenessMetrics,
  EconomicOutcomeResult,
  HealthMetricResult,
} from "./types";
import { FormatUtils } from "./format-utils";

/**
 * Cost-effectiveness analysis module
 */
export class CostEffectivenessAnalyzer {
  /**
   * Calculate cost-effectiveness metrics
   */
  public calculateMetrics(
    costs: EconomicOutcomeResult[],
    healthOutcomes: HealthMetricResult[],
  ): CostEffectivenessMetrics {
    const totalCosts = this.calculateTotalCosts(costs);
    const totalQALYs = this.calculateTotalQALYs(healthOutcomes);
    const annualSavings = this.calculateAnnualSavings(costs);

    return {
      incrementalCostEffectivenessRatio: this.calculateICER(
        totalCosts,
        totalQALYs,
      ),
      numberNeededToTreat: this.calculateNNT(healthOutcomes),
      returnOnInvestment: this.calculateROI(totalCosts, annualSavings),
      paybackPeriod: this.calculatePaybackPeriod(totalCosts, annualSavings),
    };
  }

  /**
   * Calculate total intervention costs
   */
  private calculateTotalCosts(costs: EconomicOutcomeResult[]): number {
    return costs
      .filter((c) => c.metricId.toLowerCase().includes("cost"))
      .reduce((sum, c) => sum + c.absoluteChange, 0);
  }

  /**
   * Calculate total QALYs gained
   */
  private calculateTotalQALYs(outcomes: HealthMetricResult[]): number {
    return outcomes
      .filter((o) => o.metricId.toLowerCase().includes("qaly"))
      .reduce((sum, o) => sum + o.absoluteChange, 0);
  }

  /**
   * Calculate annual cost savings
   */
  private calculateAnnualSavings(costs: EconomicOutcomeResult[]): number {
    return costs
      .filter((c) => c.metricId.toLowerCase().includes("savings"))
      .reduce((sum, c) => sum + c.absoluteChange, 0);
  }

  /**
   * Calculate Incremental Cost-Effectiveness Ratio (ICER)
   */
  private calculateICER(totalCosts: number, totalQALYs: number): number {
    if (totalQALYs === 0) return Infinity;
    return totalCosts / totalQALYs;
  }

  /**
   * Calculate Number Needed to Treat (NNT)
   */
  private calculateNNT(outcomes: HealthMetricResult[]): number {
    // Use the first health outcome's relative change
    // Typically this would be the primary outcome
    const primaryOutcome = outcomes[0];
    if (!primaryOutcome) return Infinity;

    return 100 / Math.abs(primaryOutcome.relativeChange);
  }

  /**
   * Calculate Return on Investment (ROI)
   */
  private calculateROI(totalCosts: number, annualSavings: number): number {
    if (totalCosts === 0) return 0;
    // Calculate 5-year ROI
    return ((annualSavings * 5) / totalCosts - 1) * 100;
  }

  /**
   * Calculate Payback Period in years
   */
  private calculatePaybackPeriod(
    totalCosts: number,
    annualSavings: number,
  ): number {
    if (annualSavings <= 0) return Infinity;
    return totalCosts / annualSavings;
  }

  /**
   * Evaluate cost-effectiveness based on thresholds
   */
  public evaluateCostEffectiveness(
    metrics: CostEffectivenessMetrics,
    thresholds: {
      favorable: number;
      acceptable: number;
      unfavorable: number;
    },
  ): {
    assessment: "favorable" | "acceptable" | "unfavorable";
    explanation: string;
  } {
    const { incrementalCostEffectivenessRatio: icer } = metrics;

    if (icer <= thresholds.favorable) {
      return {
        assessment: "favorable",
        explanation: `ICER of ${FormatUtils.formatICER(icer)} is below the favorable threshold of ${FormatUtils.formatCurrency(thresholds.favorable)}/QALY`,
      };
    }

    if (icer <= thresholds.acceptable) {
      return {
        assessment: "acceptable",
        explanation: `ICER of ${FormatUtils.formatICER(icer)} is within acceptable range (${FormatUtils.formatCurrency(thresholds.favorable)}-${FormatUtils.formatCurrency(thresholds.acceptable)}/QALY)`,
      };
    }

    return {
      assessment: "unfavorable",
      explanation: `ICER of ${FormatUtils.formatICER(icer)} exceeds the acceptable threshold of ${FormatUtils.formatCurrency(thresholds.acceptable)}/QALY`,
    };
  }

  /**
   * Generate a summary report of cost-effectiveness analysis
   */
  public generateSummaryReport(
    metrics: CostEffectivenessMetrics,
    thresholds: {
      favorable: number;
      acceptable: number;
      unfavorable: number;
    },
  ): string {
    const evaluation = this.evaluateCostEffectiveness(metrics, thresholds);
    const {
      incrementalCostEffectivenessRatio,
      numberNeededToTreat,
      returnOnInvestment,
      paybackPeriod,
    } = metrics;

    return [
      `Cost-Effectiveness Analysis Summary:`,
      `- Assessment: ${evaluation.assessment.toUpperCase()}`,
      `- ${evaluation.explanation}`,
      `- Number Needed to Treat: ${numberNeededToTreat.toFixed(1)} patients`,
      `- Return on Investment: ${FormatUtils.formatChange(returnOnInvestment, { asPercentage: true })} over 5 years`,
      `- Payback Period: ${FormatUtils.formatYears(paybackPeriod)}`,
      ``,
      `This intervention is ${evaluation.assessment} from a cost-effectiveness perspective.`,
    ].join("\n");
  }
}
