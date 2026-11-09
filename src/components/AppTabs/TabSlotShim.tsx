/**
 * TEMPORARY (pragma-tabs-slot): stand-in for `TabItem.slot`, which Pragma adds
 * in canonical/pragma-web#1576. The installed `@canonical/react-ds-global`
 * only accepts plain-text tab labels, so `AppTabs` passes each item's `slot`
 * to `TabLink` through context and `TabLink` renders it after the label, as
 * upstream will.
 *
 * Once a `@canonical/react-ds-global` release with `TabItem.slot` is installed:
 * 1. Delete this file and `TabSlotShim.module.scss`.
 * 2. In `AppTabs.tsx`, remove `<TabSlotsProvider>` and pass `slot` in the
 *    `navigationRoot` items.
 * 3. In `TabLink.tsx`, render `children` instead of `useLabelWithSlot(children)`.
 */
import type { FC, ReactNode } from "react";
import { createContext, use } from "react";
import classes from "./TabSlotShim.module.scss";
import type { AppTabItem } from "./types";

const TabSlotsContext = createContext<ReadonlyMap<string, ReactNode>>(
  new Map(),
);

interface TabSlotsProviderProps {
  readonly items: readonly AppTabItem[];
  readonly children: ReactNode;
}

export const TabSlotsProvider: FC<TabSlotsProviderProps> = ({
  items,
  children,
}) => (
  <TabSlotsContext
    value={new Map(items.map(({ label, slot }) => [label, slot]))}
  >
    {children}
  </TabSlotsContext>
);

/** Appends the slot of the tab whose plain-text label is `label`. */
export const useLabelWithSlot = (label: ReactNode): ReactNode => {
  const slots = use(TabSlotsContext);
  const slot = typeof label === "string" ? slots.get(label) : undefined;

  return slot ? (
    <>
      {label}
      <span className={classes.slot}>{slot}</span>
    </>
  ) : (
    label
  );
};
