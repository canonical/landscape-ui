import { createTablePropGetters } from "@/utils/table";
import type { PackageProfile } from "../../types";

export const { getCellProps, getRowProps } =
  createTablePropGetters<PackageProfile>({
    itemTypeName: "package profile",
    headerColumnId: "title",
  });
