import type { Intervention } from "../../src/types";

const bodyCompositionDrug: Intervention = {
  id: "body-composition-drug",
  name: "Body Composition Enhancement Drug",
  description:
    "Novel pharmaceutical intervention that simultaneously reduces fat mass and increases muscle mass",
  emoji: "💊",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  primaryOutcomes: [
    {
      id: "fat-mass-reduction",
      name: "Fat Mass Reduction",
      description: "Reduction in total body fat mass",
      emoji: "⬇️",
      unit: "lbs",
      defaultValue: 2.0,
      bestCaseValue: 3.0,
      worstCaseValue: 1.0,
      datasources: [
        {
          id: "fat-mass-study-1",
          url: "https://example.com/clinical-trial-2024",
          title: "Phase III Clinical Trial Results",
          author: "Smith et al.",
          publication: "Journal of Metabolic Research",
          year: 2024,
          doi: "10.1234/jmr.2024.001",
          quote:
            "Mean fat mass reduction of 2.0 ± 0.5 lbs over 12 weeks of treatment",
          citationType: "journal",
        },
      ],
      secondaryOutcomes: [
        {
          id: "insulin-sensitivity-fat",
          name: "Insulin Sensitivity Improvement from Fat Loss",
          description:
            "Improvement in insulin sensitivity due to reduced fat mass",
          emoji: "📉",
          unit: "%",
          equationText:
            "{{parameter:insulin-sensitivity-per-pound-fat}} * {{primary:Fat Mass Reduction}}",
          baselineValue: 0,
          baselineEquationText: "0",
          parameters: [
            {
              id: "insulin-sensitivity-per-pound-fat",
              name: "Insulin Sensitivity Improvement per Pound Fat Lost",
              description:
                "Percentage improvement in insulin sensitivity per pound of fat mass lost",
              unit: "%/lb",
              defaultValue: 2.5,
              bestCaseValue: 3.5,
              worstCaseValue: 1.5,
              datasources: [
                {
                  id: "insulin-fat-source",
                  url: "https://example.com/meta-analysis-2023",
                  title: "Meta-analysis of Fat Loss and Insulin Sensitivity",
                  author: "Johnson et al.",
                  publication: "Diabetes Care",
                  year: 2023,
                  quote:
                    "Each pound of fat loss was associated with 2.5% improvement in insulin sensitivity",
                  citationType: "journal",
                },
              ],
            },
          ],
          datasources: [],
        },
      ],
    },
    {
      id: "muscle-mass-increase",
      name: "Muscle Mass Increase",
      description: "Increase in skeletal muscle mass",
      emoji: "💪",
      unit: "lbs",
      defaultValue: 2.0,
      bestCaseValue: 2.5,
      worstCaseValue: 1.5,
      datasources: [
        {
          id: "muscle-mass-study-1",
          url: "https://example.com/clinical-trial-2024-muscle",
          title: "Phase III Clinical Trial Results - Muscle Mass Analysis",
          author: "Smith et al.",
          publication: "Journal of Metabolic Research",
          year: 2024,
          doi: "10.1234/jmr.2024.002",
          quote:
            "Mean muscle mass increase of 2.0 ± 0.3 lbs over 12 weeks of treatment",
          citationType: "journal",
        },
      ],
      secondaryOutcomes: [
        {
          id: "insulin-sensitivity-muscle",
          name: "Insulin Sensitivity Improvement from Muscle Gain",
          description:
            "Improvement in insulin sensitivity due to increased muscle mass",
          emoji: "📊",
          unit: "%",
          equationText:
            "{{parameter:insulin-sensitivity-per-pound-muscle}} * {{primary:Muscle Mass Increase}}",
          baselineValue: 0,
          baselineEquationText: "0",
          parameters: [
            {
              id: "insulin-sensitivity-per-pound-muscle",
              name: "Insulin Sensitivity Improvement per Pound Muscle Gained",
              description:
                "Percentage improvement in insulin sensitivity per pound of muscle mass gained",
              unit: "%/lb",
              defaultValue: 5.0,
              bestCaseValue: 6.0,
              worstCaseValue: 4.0,
              datasources: [
                {
                  id: "insulin-muscle-source",
                  url: "https://example.com/research-2023",
                  title: "Muscle Mass and Metabolic Health",
                  author: "Brown et al.",
                  publication: "Cell Metabolism",
                  year: 2023,
                  quote:
                    "Each pound of muscle gain was associated with 5% improvement in insulin sensitivity",
                  citationType: "journal",
                },
              ],
            },
          ],
          datasources: [],
        },
        {
          id: "healthcare-savings",
          name: "Healthcare Cost Savings",
          description:
            "Annual healthcare cost savings from improved body composition",
          emoji: "💰",
          unit: "USD",
          equationText:
            "{{parameter:savings-per-pound}} * ({{primary:Fat Mass Reduction}} + {{primary:Muscle Mass Increase}})",
          baselineValue: 0,
          baselineEquationText: "0",
          parameters: [
            {
              id: "savings-per-pound",
              name: "Healthcare Savings per Pound of Improved Body Composition",
              description:
                "Annual healthcare cost savings per pound of improved body composition",
              unit: "USD/lb",
              defaultValue: 425,
              bestCaseValue: 550,
              worstCaseValue: 300,
              datasources: [
                {
                  id: "cost-savings-source",
                  url: "https://example.com/economic-analysis-2023",
                  title: "Economic Impact of Body Composition Changes",
                  author: "Wilson et al.",
                  publication: "Health Economics",
                  year: 2023,
                  quote:
                    "Each pound of improved body composition (fat loss or muscle gain) was associated with $425 in annual healthcare savings",
                  citationType: "journal",
                },
              ],
            },
          ],
          datasources: [],
        },
      ],
    },
  ],
  costEffectivenessMetrics: {
    incrementalCostEffectivenessRatio: {
      description: "Cost per QALY gained",
      equationText:
        "{{parameter:annual-drug-cost}} / ({{secondary:insulin-sensitivity-fat}} + {{secondary:insulin-sensitivity-muscle}}) * 100000",
      thresholds: {
        favorable: 50000,
        acceptable: 100000,
        unfavorable: 150000,
      },
    },
    numberNeededToTreat: {
      description:
        "Number needed to treat for one person to achieve target outcome",
      equationText:
        "100 / (({{secondary:insulin-sensitivity-fat}} + {{secondary:insulin-sensitivity-muscle}}) / 2)",
      thresholds: {
        favorable: 10,
        acceptable: 20,
        unfavorable: 30,
      },
    },
  },
  budgetImpact: {
    timeHorizons: [1, 3, 5],
    discountRate: 3,
    yearByYearProjection: {
      equationText:
        "{{secondary:healthcare-savings}} * (1 - Math.pow(1 - {{parameter:discount-rate}}/100, {{parameter:year}}))",
      parameters: [
        {
          id: "discount-rate",
          name: "Annual Discount Rate",
          description: "Rate used to discount future costs and savings",
          unit: "%",
          defaultValue: 3,
          bestCaseValue: 2,
          worstCaseValue: 5,
          datasources: [],
        },
      ],
    },
  },
};

export default bodyCompositionDrug;
