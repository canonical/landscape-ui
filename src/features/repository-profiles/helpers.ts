import type { RepositoryProfilePocket } from "./types/RepositoryProfile";
import type { Distribution } from "../mirrors";

export const getDistributions = (pockets: RepositoryProfilePocket[]) => {
  const distributions: Distribution[] = [];
  pockets.forEach(({ distribution, series, ...pocket }) => {
    const existingDistribution = distributions.find(({ name }) => name === distribution.name);
    const existingSeries = existingDistribution?.series.find(({ name }) => name === series.name);

    const pocketWithDistributionAndSeries = { ...pocket, distribution, series };
    const seriesWithPocket = { ...series, pockets: [pocketWithDistributionAndSeries] };
    const distributionWithSeries = { ...distribution, series: [seriesWithPocket] };

    if (existingSeries) {
      existingSeries.pockets.push(pocketWithDistributionAndSeries);
    } else if (existingDistribution) {
      existingDistribution.series.push(seriesWithPocket);
    } else {
      distributions.push(distributionWithSeries);
    }
  });

  return distributions;
};
