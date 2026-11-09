import type { TabSlot } from "@/libs/pageParamsManager";
import { pageParamsManager } from "@/libs/pageParamsManager";
import type { AppTabItem } from "./types";

const isSelectable = <Id extends string>(
  item: AppTabItem<Id> | undefined,
): item is AppTabItem<Id> => !!item && !item.disabled;

/**
 * Resolves the active tab: the URL value when it names a selectable item,
 * then `defaultId`, then the first selectable item.
 */
export const getActiveTabId = <Id extends string>({
  items,
  value,
  defaultId,
}: {
  readonly items: readonly AppTabItem<Id>[];
  readonly value: string | undefined;
  readonly defaultId?: Id;
}): Id | undefined => {
  const requested = items.find(({ id }) => id === value);
  const fallback = items.find(({ id }) => id === defaultId);

  return [requested, fallback, items.find(isSelectable)].find(isSelectable)
    ?.id;
};

/**
 * The router destination of a tab link. A slot strip's default tab removes
 * its slot value, so the canonical URL of a default view has no tab state.
 */
export const getTabHref = ({
  pathname,
  searchParams,
  slot,
  id,
  isDefault,
}: {
  readonly pathname: string;
  readonly searchParams: URLSearchParams;
  readonly slot: TabSlot | undefined;
  readonly id: string;
  readonly isDefault: boolean;
}): string => {
  const search = pageParamsManager
    .getTabSearchParams(searchParams, {
      slot,
      id: slot && isDefault ? "" : id,
    })
    .toString();

  return search ? `${pathname}?${search}` : pathname;
};
