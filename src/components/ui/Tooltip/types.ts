import type { WithTooltipOptions } from "@canonical/react-ds-global";
import type { ReactNode } from "react";

export type TooltipProps = WithTooltipOptions & {
  readonly children: ReactNode;
  readonly message: ReactNode;
};
