import type { EconomicOutcome } from "../../src/types";

export const healthcareCosts: EconomicOutcome[] = [
  {
    id: "diabetes-annual-cost",
    name: "Annual Diabetes Care Cost",
    description:
      "Average annual healthcare costs for diabetes management per person",
    emoji: "💰",
    unit: "USD",
    baselineValue: 16750,
    category: "direct-medical",
    components: [
      {
        name: "Medications",
        value: 4800,
        percentage: 28.7,
      },
      {
        name: "Outpatient Care",
        value: 3900,
        percentage: 23.3,
      },
      {
        name: "Inpatient Care",
        value: 5200,
        percentage: 31.0,
      },
      {
        name: "Medical Supplies",
        value: 1850,
        percentage: 11.0,
      },
      {
        name: "Other Services",
        value: 1000,
        percentage: 6.0,
      },
    ],
    metadata: {
      source: "American Diabetes Association Economic Costs Study 2022",
      lastUpdated: "2023-01-01",
      notes:
        "Costs may vary significantly based on complications and treatment regimen",
    },
  },
  {
    id: "complication-costs",
    name: "Diabetes Complication Costs",
    description:
      "Additional healthcare costs for managing diabetes complications",
    emoji: "🏥",
    unit: "USD",
    baselineValue: 8500,
    category: "direct-medical",
    components: [
      {
        name: "Cardiovascular Complications",
        value: 3500,
        percentage: 41.2,
      },
      {
        name: "Kidney Disease",
        value: 2200,
        percentage: 25.9,
      },
      {
        name: "Neuropathy",
        value: 1500,
        percentage: 17.6,
      },
      {
        name: "Eye Disease",
        value: 800,
        percentage: 9.4,
      },
      {
        name: "Other Complications",
        value: 500,
        percentage: 5.9,
      },
    ],
    metadata: {
      source: "CDC Diabetes Cost-effectiveness Group Analysis 2023",
      lastUpdated: "2023-06-30",
      notes:
        "Costs represent average annual additional expenses for patients with complications",
    },
  },
];

export default healthcareCosts;
