import usePageParams from "@/hooks/usePageParams";
import { getActiveTabId } from "./helpers";
import type { AppTabsProps } from "./types";

/**
 * The tab an `AppTabs` strip with the same props shows, for consumers that
 * render the active panel themselves.
 */
const useActiveTabId = <Id extends string>({
  items,
  slot,
  defaultId,
}: Pick<AppTabsProps<Id>, "items" | "slot" | "defaultId">): Id | undefined => {
  const { tab, tabSlots } = usePageParams();

  return getActiveTabId({
    items,
    value: slot ? tabSlots[slot] : tab,
    defaultId,
  });
};

export default useActiveTabId;
