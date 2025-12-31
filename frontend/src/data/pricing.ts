import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
  {
    name: "Basic",
    price: 29,
    period: "month",
    features: [
      "AI thumbnail generator",
      "50 thumbnails / month",
      "Standard styles",
      "HD exports",
      "Community support",
    ],
    mostPopular: false,
  },
  {
    name: "Pro",
    price: 79,
    period: "month",
    features: [
      "Unlimited thumbnails",
      "Advanced styles",
      "Face & text boost",
      "HD + 4K exports",
      "Priority support",
      "Brand presets",
      "CTR optimization",
    ],
    mostPopular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    features: [
      "All Pro features",
      "Unlimited team access",
      "Custom brand models",
      "Bulk generation",
      "Dedicated support",
    ],
    mostPopular: false,
  },
];
