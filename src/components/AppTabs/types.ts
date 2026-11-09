import type { TabSlot } from "@/libs/pageParamsManager";
import type { ReactNode } from "react";

export interface AppTabItem<Id extends string = string> {
  /** URL value of the tab; must not contain ":". */
  readonly id: Id;
  /** Plain-text tab name. */
  readonly label: string;
  /**
   * Rich rendering of the label, e.g. with a count badge or a loading
   * indicator. Defaults to `label`.
   */
  readonly labelContent?: ReactNode;
  /** Content rendered below the strip while this tab is active. */
  readonly panel?: ReactNode;
  readonly disabled?: boolean;
}

export interface AppTabsProps<Id extends string = string> {
  /** Accessible name of the tab navigation landmark. */
  readonly "aria-label": string;
  readonly items: readonly AppTabItem<Id>[];
  /**
   * Stores the active tab under a "tab=<slot>:<id>" URL value so the strip can
   * coexist with the page-level strip. Omit for the page-level strip, which
   * owns the bare "tab=<id>" value.
   */
  readonly slot?: TabSlot;
  /** Tab shown when the URL has no valid value. Defaults to the first item. */
  readonly defaultId?: Id;
  readonly panelClassName?: string;
}
