import { createTablePropGetters } from "@/utils/table";
import type { RepositoryProfile } from "../../types";

export const { getCellProps, getRowProps } =
  createTablePropGetters<RepositoryProfile>({
    itemTypeName: "repository profile",
    headerColumnId: "title",
  });
