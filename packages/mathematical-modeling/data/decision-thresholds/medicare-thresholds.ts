import type { DecisionThresholds } from "../../src/types";

export const medicareThresholds: DecisionThresholds = {
  costEffectivenessThresholds: {
    favorable: 50000, // $50,000 per QALY
    acceptable: 100000, // $100,000 per QALY
    unfavorable: 150000, // $150,000 per QALY
  },
  budgetImpactThresholds: {
    lowImpact: 10000000, // $10M per year
    moderateImpact: 50000000, // $50M per year
    highImpact: 100000000, // $100M per year
  },
  returnOnInvestmentThresholds: {
    minimum: 0.1, // 10% ROI
    target: 0.2, // 20% ROI
    optimal: 0.3, // 30% ROI
  },
  paybackPeriodThresholds: {
    optimal: 2, // 2 years or less
    acceptable: 5, // 5 years or less
    maximum: 10, // 10 years maximum
  },
  metadata: {
    source: "Medicare Coverage Analysis Guidelines 2023",
    lastUpdated: "2023-12-31",
    notes:
      "Thresholds are based on Medicare's standard coverage determination process",
    applicableRegions: ["United States"],
    reviewFrequency: "Annual",
  },
};

export default medicareThresholds;
