import { Distribution } from "@/types/Distribution";

const getDistributionPocketOptions = (distributions: Distribution[]) => {
  return distributions
    .filter(
      ({ series }) =>
        series.length && series.some(({ pockets }) => pockets.length),
    )
    .map(({ name: distributionName, series }) => ({
      distributionName,
      series: series
        .filter(({ pockets }) => pockets.length)
        .map(({ name: seriesName, pockets }) => ({
          seriesName,
          pockets: pockets.map(({ name: pocketName, id }) => ({
            pocketName,
            value: id,
          })),
        })),
    }));
};

export const getFilteredDistributionPocketOptions = (
  distributions: Distribution[],
  searchText: string,
) => {
  const options = getDistributionPocketOptions(distributions);

  const filteredDistributionPocketOptions: typeof options = [];

  for (const { distributionName, series } of options) {
    if (distributionName.match(searchText)) {
      filteredDistributionPocketOptions.push({ distributionName, series });
    } else {
      const filteredSeries: (typeof options)[number]["series"] = [];

      for (const { seriesName, pockets } of series) {
        if (seriesName.match(searchText)) {
          filteredSeries.push({ seriesName, pockets });
        } else {
          const filteredPockets: (typeof options)[number]["series"][number]["pockets"] =
            [];

          for (const { pocketName, value } of pockets) {
            if (pocketName.match(searchText)) {
              filteredPockets.push({ pocketName, value });
            }
          }

          if (filteredPockets.length) {
            filteredSeries.push({ seriesName, pockets: filteredPockets });
          }
        }
      }

      if (filteredSeries.length) {
        filteredDistributionPocketOptions.push({
          distributionName,
          series: filteredSeries,
        });
      }
    }
  }

  return filteredDistributionPocketOptions;
};
