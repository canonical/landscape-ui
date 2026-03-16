import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useMemo } from "react";
import type { Profile } from "../../types";
import { createTablePropGetters } from "@/utils/table";
import type { Column } from "react-table";
import {
  getComplianceColumns,
  getGeneralColumns,
  getRebootColumn,
  getRemovalColumn,
  getScriptColumns,
  getSecurityColumns,
  getStatusColumn,
} from "./helpers";
import {
  canArchiveProfile,
  hasApiSearch,
  hasDescription,
  hasComplianceColumns,
  ProfileTypes,
} from "../../helpers";
import { useOpenViewProfileSidePanel } from "../../hooks";

interface ProfilesListProps {
  readonly profiles: Profile[];
  readonly type: ProfileTypes;
}

const ProfilesList: FC<ProfilesListProps> = ({ profiles, type }) => {
  const { search } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { expandedRowIndex, getTableRowsRef } = useExpandableRow();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();
  const { getCellProps, getRowProps } = createTablePropGetters<Profile>({
    headerColumnId: "title",
    itemTypeName: "profile",
  });

  const openViewProfileSidePanel = useOpenViewProfileSidePanel();

  const filteredProfiles = useMemo(() => {
    if (!search || hasApiSearch(type)) {
      return profiles;
    }

    return profiles.filter(({ title }) =>
      title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [profiles, search, type]);

  const columns = useMemo<Column<Profile>[]>(() => {
    const { name, accessGroup, associated, description, actions } =
      getGeneralColumns(
        type,
        openViewProfileSidePanel,
        getAccessGroupQueryResult,
      );
    const cols = [name];

    if (canArchiveProfile(type)) {
      cols.push(...getStatusColumn());
    }

    cols.push(accessGroup, associated);

    if (hasComplianceColumns(type)) {
      cols.push(...getComplianceColumns());
    }

    if (type === ProfileTypes.security) {
      cols.push(...getSecurityColumns());
    }

    if (type === ProfileTypes.script) {
      cols.push(...getScriptColumns());
    }

    if (type === ProfileTypes.reboot) {
      cols.push(...getRebootColumn());
    }

    if (type === ProfileTypes.removal) {
      cols.push(...getRemovalColumn());
    }

    if (hasDescription(type)) {
      cols.push(description);
    }

    cols.push(actions);

    return cols;
  }, [getAccessGroupQueryResult, openViewProfileSidePanel, type]);

  return (
    <ResponsiveTable
      ref={getTableRowsRef}
      columns={columns}
      data={filteredProfiles}
      emptyMsg={`No ${type} profiles found according to your search parameters.`}
      getCellProps={getCellProps(expandedRowIndex)}
      getRowProps={getRowProps(expandedRowIndex)}
    />
  );
};

export default ProfilesList;
