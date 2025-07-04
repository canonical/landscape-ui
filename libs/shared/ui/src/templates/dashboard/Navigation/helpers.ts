import type { MenuItem } from "./types";

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
  menuItems,
}: {
  isSaas: boolean;
  isSelfHosted: boolean;
  menuItems: MenuItem[];
}) => {
  return getFilteredByEnvItems({
    isSaas,
    isSelfHosted,
    items: menuItems,
  });
};

export const getPathToExpand = (pathname: string, menuItems: MenuItem[]) => {
  return menuItems
    .filter(({ items }) => items && items.length > 0)
    .find(({ path }) => pathname.startsWith(path))?.path;
};
