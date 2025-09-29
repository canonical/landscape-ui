import { createTablePropGetters } from "@/utils/table";
import type { SecurityProfile } from "../../types";

export const { getCellProps, getRowProps } =
  createTablePropGetters<SecurityProfile>({
    itemTypeName: "security profile",
    headerColumnId: "title",
  });
