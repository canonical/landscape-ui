import { Distribution } from "../../../../types/Distribution";
import { AccessGroup } from "../../../../types/AccessGroup";
import { APTSource } from "../../../../types/APTSource";
import { RepositoryProfilePocket } from "../../../../types/RepositoryProfile";

export const getDistributionPocketOptions = (distributions: Distribution[]) => {
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
          pockets: pockets.map(({ name: pocketName }) => ({
            pocketName,
            value: `${distributionName}/${seriesName}/${pocketName}`,
          })),
        })),
    }));
};

export const getFilteredDistributionPocketOptions = (
  options: ReturnType<typeof getDistributionPocketOptions>,
  searchText: string,
) => {
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

export const getAccessGroupsOptions = (accessGroups: AccessGroup[]) => {
  return accessGroups.map((accessGroup) => ({
    label: accessGroup.title,
    value: accessGroup.name,
  }));
};

export const getFilteredAptSources = (
  aptSources: APTSource[],
  searchText: string,
) => {
  return searchText
    ? aptSources.filter(
        ({ name, line }) => name.match(searchText) || line.match(searchText),
      )
    : aptSources;
};

export const getFullProfilePocketNames = (
  profilePockets: RepositoryProfilePocket[],
) => {
  return profilePockets.map(({ distribution, name, series }) => {
    return `${distribution.name}/${series.name}/${name}`;
  });
};
