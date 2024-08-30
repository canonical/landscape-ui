import { MenuItem } from "./types";
import { MENU_ITEMS } from "./constants";

const getFilteredByEnvItems = ({
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

export const getFilteredByEnvMenuItems = ({
  isSaas,
  isSelfHosted,
}: {
  isSaas: boolean;
  isSelfHosted: boolean;
}) => {
  return getFilteredByEnvItems({
    isSaas,
    isSelfHosted,
    items: MENU_ITEMS,
  });
};

export const getPathToExpand = (pathname: string) => {
  return MENU_ITEMS.filter(({ items }) => items && items.length > 0).find(
    ({ path }) => pathname.startsWith(path),
  )?.path;
};
