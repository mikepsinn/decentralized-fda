import type { Population } from "../../src/types";

const usDiabetesPopulation: Population = {
  id: "us-diabetes-2023",
  name: "US Diabetes Population 2023",
  description: "Adult population with diagnosed diabetes in the United States",
  emoji: "🏥",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-12-31T00:00:00Z",
  totalSize: 37300000,
  demographics: {
    ageGroups: {
      "18-44": 0.15,
      "45-64": 0.45,
      "65+": 0.4,
    },
    gender: {
      male: 0.52,
      female: 0.48,
    },
    ethnicity: {
      white: 0.6,
      black: 0.16,
      hispanic: 0.14,
      asian: 0.08,
      other: 0.02,
    },
  },
  riskFactors: {
    obesity: 0.65,
    hypertension: 0.73,
    cardiovascularDisease: 0.35,
    chronicKidneyDisease: 0.21,
  },
  healthcareAccess: {
    insured: 0.92,
    medicare: 0.45,
    medicaid: 0.15,
    private: 0.32,
    uninsured: 0.08,
  },
  metadata: {
    source: "CDC National Diabetes Statistics Report 2023",
    lastUpdated: "2023-12-31",
    notes:
      "All values are approximations based on available public health data",
  },
};

export default usDiabetesPopulation;
