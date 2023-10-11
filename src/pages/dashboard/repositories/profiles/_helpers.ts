import { Distribution } from "../../../../types/Distribution";
import { AccessGroup } from "../../../../types/AccessGroup";
import { APTSource } from "../../../../types/APTSource";
import {
  RepositoryProfile,
  RepositoryProfilePocket,
} from "../../../../types/RepositoryProfile";

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

interface IsProfileChangedProps {
  name: string;
  title: string;
  description: string;
  tags: string[];
  all_computers: boolean;
  apt_sources: string[];
  pockets: string[];
}

export const isProfileChanged = (
  profile: RepositoryProfile,
  formikValues: IsProfileChangedProps,
  fullPocketNames: string[],
) => {
  const changes: {
    [key in keyof Omit<IsProfileChangedProps, "name">]: boolean;
  } = {
    title: false,
    description: false,
    all_computers: false,
    tags: false,
    apt_sources: false,
    pockets: false,
  };

  for (const formikValuesKey in formikValues) {
    const key = formikValuesKey as keyof IsProfileChangedProps;

    if ("name" === key) {
      continue;
    }

    if ("title" === key || "description" === key || "all_computers" === key) {
      if ("title" === key && "" === formikValues.title) {
        changes.title = false;
      } else changes[key] = formikValues[key] !== profile[key];
    } else if ("pockets" === key) {
      changes.pockets =
        formikValues.pockets.length !== fullPocketNames.length ||
        !formikValues.pockets.every((pocketName) =>
          fullPocketNames.includes(pocketName),
        );
    } else {
      changes[key] =
        profile[key].length !== formikValues[key].length ||
        !profile[key].every((item) => formikValues[key].includes(item));
    }
  }

  return Object.values(changes).some((value) => value);
};
