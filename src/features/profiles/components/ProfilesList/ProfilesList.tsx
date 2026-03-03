import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useMemo } from "react";
import type { Profile, ProfileType } from "../../types";
import { createTablePropGetters } from "@/utils/table";
import type { Column } from "react-table";
import { ViewProfileSidePanel } from "../..";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/SidePanel/LoadingState";
import Suspense from "@/components/layout/SidePanel/Suspense";
import { getComplianceColumns, getGeneralColumns, getRebootColumn, getRemovalColumn, getScriptColumns, getSecurityColumns, getStatusColumn } from "./helpers";

interface ProfilesListProps {
  readonly profiles: Profile[];
  readonly type: ProfileType;
}
  
const ProfilesList: FC<ProfilesListProps> = ({ profiles, type }) => {
  const { search } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { expandedRowIndex, getTableRowsRef } =
    useExpandableRow();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();
  const { getCellProps, getRowProps } = createTablePropGetters<Profile>({
      headerColumnId: "title",
      itemTypeName: "profile",
    });

  const { setSidePanelContent } = useSidePanel();

  const filteredProfiles = useMemo(() => {
    if (!search) {
      return profiles;
    }

    return profiles.filter(({ title }) => title.toLowerCase().includes(search.toLowerCase()));
  }, [profiles, search]); // in Package, Reboot, Removal, Repository, Upgrade


  const columns = useMemo<Column<Profile>[]>(() => {
    const handleNameClick = (profile: Profile) => {
      setSidePanelContent(
        `${profile.title}`,
        <Suspense fallback={<LoadingState />}>
          <ViewProfileSidePanel
            profile={profile}
            type={type}
          />
        </Suspense>,
      );
    };
    const { name, accessGroup, associated, description, actions } = getGeneralColumns(type, handleNameClick, getAccessGroupQueryResult);
    const cols = [name];

    if (type === "script" || type === "security") {
      cols.push(...getStatusColumn());
    }

    cols.push(accessGroup, associated);

    if (type === "package" || type === "wsl") {
      cols.push(...getComplianceColumns(type));
    }

    if (type === "security") {
      cols.push(...getSecurityColumns());
    }

    if (type === "script") {
      cols.push(...getScriptColumns());
    }

    if (type === "reboot") {
      cols.push(...getRebootColumn());
    }

    if (type === "removal") {
      cols.push(...getRemovalColumn());
    }

    if (type === "security") {
      cols.push(...getSecurityColumns());
    }

    if (type === "repository" || type === "wsl" || type === "package") {
      cols.push(description);
    }
    
    cols.push(actions);

    return cols;
  },
    [getAccessGroupQueryResult, setSidePanelContent, type],
  );

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
