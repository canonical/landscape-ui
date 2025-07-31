import type { ComponentProps, FC } from "react";
import TableFilterChipsBase from "../TableFilterChipsBase";

type SidePanelTableFilterChipsProps = ComponentProps<
  typeof TableFilterChipsBase
>;

const SidePanelTableFilterChips: FC<SidePanelTableFilterChipsProps> = (
  props,
) => {
  return <TableFilterChipsBase {...props} />;
};

export default SidePanelTableFilterChips;
