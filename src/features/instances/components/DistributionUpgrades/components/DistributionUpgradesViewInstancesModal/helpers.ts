import type { DistributionCategory } from "./types";

export const getModalTitle = (category: DistributionCategory) => {
  if (category.isIneligibleCategory) {
    return "Cannot be upgraded";
  }

  return category.title;
};
