import type { HealthMetric } from "../../src/types";

export const metabolicMetrics: HealthMetric[] = [
  {
    id: "hba1c",
    name: "HbA1c Level",
    description:
      "Glycated hemoglobin level indicating average blood glucose over past 3 months",
    emoji: "🔬",
    unit: "%",
    normalRange: {
      min: 4.0,
      max: 5.7,
      preDiabetic: {
        min: 5.7,
        max: 6.4,
      },
      diabetic: {
        min: 6.5,
        max: null,
      },
    },
    targetRange: {
      min: 6.5,
      max: 7.0,
      description: "Target range for most adults with diabetes",
    },
    metadata: {
      measurementFrequency: "3-6 months",
      testType: "Blood test",
      interpretationGuidelines: "Values >9% indicate poor glycemic control",
    },
  },
  {
    id: "fasting-glucose",
    name: "Fasting Blood Glucose",
    description: "Blood glucose level after fasting for at least 8 hours",
    emoji: "🩸",
    unit: "mg/dL",
    normalRange: {
      min: 70,
      max: 99,
      preDiabetic: {
        min: 100,
        max: 125,
      },
      diabetic: {
        min: 126,
        max: null,
      },
    },
    targetRange: {
      min: 80,
      max: 130,
      description: "Target range for people with diabetes before meals",
    },
    metadata: {
      measurementFrequency: "Daily",
      testType: "Blood test",
      interpretationGuidelines: "Values <70 mg/dL indicate hypoglycemia",
    },
  },
  {
    id: "insulin-sensitivity",
    name: "Insulin Sensitivity",
    description: "Measure of how effectively body cells respond to insulin",
    emoji: "📊",
    unit: "HOMA-IR",
    normalRange: {
      min: 0.5,
      max: 1.4,
      preDiabetic: {
        min: 1.5,
        max: 2.9,
      },
      diabetic: {
        min: 3.0,
        max: null,
      },
    },
    targetRange: {
      min: 0.5,
      max: 2.0,
      description: "Target range for improved insulin sensitivity",
    },
    metadata: {
      measurementFrequency: "3-6 months",
      testType: "Calculated from fasting insulin and glucose",
      interpretationGuidelines:
        "Lower values indicate better insulin sensitivity",
    },
  },
];

export default metabolicMetrics;
