import { createTablePropGetters } from "@/utils/table";
import type { WslProfile } from "../../types";

export const { getCellProps, getRowProps } = createTablePropGetters<WslProfile>(
  {
    itemTypeName: "wsl profile",
    headerColumnId: "title",
  },
);
