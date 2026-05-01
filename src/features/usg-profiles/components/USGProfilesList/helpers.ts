import { createTablePropGetters } from "@/utils/table";
import type { USGProfile } from "../../types";

export const { getCellProps, getRowProps } = createTablePropGetters<USGProfile>(
  {
    itemTypeName: "USG profile",
    headerColumnId: "title",
  },
);
