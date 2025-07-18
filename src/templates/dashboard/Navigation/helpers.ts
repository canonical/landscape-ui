import type { MenuItem } from "./types";
import { MENU_ITEMS } from "./constants";
import type { FeatureKey } from "@/types/FeatureKey";

export const getFilteredByEnvItems = ({
  isSaas,
  isSelfHosted,
  items,
}: {
  isSaas: boolean;
  isSelfHosted: boolean;
  items: MenuItem[];
}): MenuItem[] => {
  return items
    .filter(
      ({ env }) =>
        (!isSaas && env !== "saas") || (!isSelfHosted && env !== "selfHosted"),
    )
    .map((item) =>
      item.items
        ? {
            ...item,
            items: getFilteredByEnvItems({
              items: item.items,
              isSaas,
              isSelfHosted,
            }),
          }
        : item,
    );
};

export const getFilteredByFeatureItems = ({
  isFeatureEnabled,
  items,
}: {
  isFeatureEnabled: (feature: FeatureKey) => boolean;
  items: MenuItem[];
}): MenuItem[] => {
  return items
    .filter(
      ({ requiresFeature }) =>
        !requiresFeature || isFeatureEnabled(requiresFeature),
    )
    .map((item) =>
      item.items
        ? {
            ...item,
            items: getFilteredByFeatureItems({
              items: item.items,
              isFeatureEnabled,
            }),
          }
        : item,
    );
};

export const getPathToExpand = (pathname: string) => {
  return MENU_ITEMS.filter(({ items }) => items && items.length > 0).find(
    ({ path }) => pathname.startsWith(path),
  )?.path;
};
