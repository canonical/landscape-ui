interface CreateDistributionParams {
  name: string;
}

const PRE_DEFINED_DISTRIBUTIONS: CreateDistributionParams[] = [
  {
    name: "Ubuntu",
  },
];

export const getDefaultDistribution = () => PRE_DEFINED_DISTRIBUTIONS[0];
