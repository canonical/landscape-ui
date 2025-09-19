import { createTablePropGetters } from "@/utils/table";
import type { RemovalProfile } from "../../types";

export const { getCellProps, getRowProps } =
  createTablePropGetters<RemovalProfile>({
    headerColumnId: "title",
    itemTypeName: "removal profile",
  });
