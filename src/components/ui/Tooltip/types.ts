import type { WithTooltipOptions } from "@canonical/react-ds-global";
import type { ReactNode } from "react";

export type TooltipProps = WithTooltipOptions & {
  /** Element(s) to which the tooltip is attached. */
  readonly children: ReactNode;
  /** Content of the tooltip. When empty or falsy, children render without a tooltip. */
  readonly message?: ReactNode;
};
