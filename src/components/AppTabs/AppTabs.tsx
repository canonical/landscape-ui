import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Tabs } from "@canonical/react-ds-global";
import classNames from "classnames";
import type { ReactElement } from "react";
import { Suspense, useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router";
import classes from "./AppTabs.module.scss";
import { getActiveTabId, getTabHref } from "./helpers";
import TabLink from "./TabLink";
import { TabSlotsProvider } from "./TabSlotShim";
import type { AppTabsProps } from "./types";

/**
 * URL-backed tab navigation built on Pragma `Tabs`. Each tab is a link to the
 * current page with the tab's value in the "tab" search param, so tabs can be
 * deep-linked, reloaded and opened in a new browser tab.
 */
const AppTabs = <Id extends string>({
  "aria-label": ariaLabel,
  items,
  slot,
  defaultId,
  panelClassName,
}: AppTabsProps<Id>): ReactElement => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { tab, tabSlots } = usePageParams();
  const { closeSidePanel } = useSidePanel();

  const value = slot ? tabSlots[slot] : tab;
  const activeId = getActiveTabId({ items, value, defaultId });
  const defaultTabId = getActiveTabId({ items, value: undefined, defaultId });
  const activeItem = items.find(({ id }) => id === activeId);

  const hrefs = new Map(
    items.map(({ id }) => [
      id,
      getTabHref({
        pathname,
        searchParams,
        slot,
        id,
        isDefault: id === defaultTabId,
      }),
    ]),
  );

  // Page-level tab switches close any open side panel and its notifications.
  const previousTabRef = useRef(tab);
  useEffect(() => {
    if (slot || previousTabRef.current === tab) {
      return;
    }

    previousTabRef.current = tab;
    closeSidePanel();
  }, [closeSidePanel, slot, tab]);

  return (
    <>
      {items.length > 1 && (
        <TabSlotsProvider items={items}>
          <Tabs
            aria-label={ariaLabel}
            className={classes.tabs}
            LinkComponent={TabLink}
            currentUrl={activeId && hrefs.get(activeId)}
            navigationRoot={{
              key: slot ?? "page",
              items: items.map(({ id, label, disabled }) => ({
                key: id,
                label,
                url: hrefs.get(id),
                disabled,
              })),
            }}
          />
        </TabSlotsProvider>
      )}
      {activeItem?.panel !== undefined && (
        <div className={classNames(classes.tabPanel, panelClassName)}>
          <AppErrorBoundary>
            <Suspense fallback={<LoadingState />}>{activeItem.panel}</Suspense>
          </AppErrorBoundary>
        </div>
      )}
    </>
  );
};

export default AppTabs;
