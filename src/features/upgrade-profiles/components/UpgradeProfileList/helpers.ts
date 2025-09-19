import { createTablePropGetters } from "@/utils/table";
import type { UpgradeProfile } from "../../types";

export const { getCellProps, getRowProps } =
  createTablePropGetters<UpgradeProfile>({
    headerColumnId: "title",
    itemTypeName: "upgrade profile",
  });
