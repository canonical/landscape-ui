import ResponsiveTable from "@/components/layout/ResponsiveTable";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { useMemo } from "react";
import type { Profile } from "../../types";
import type { Column } from "react-table";
import {
  getComplianceColumns,
  getGeneralColumns,
  getRebootColumn,
  getRemovalColumn,
  getScriptColumns,
  getUsgColumns,
  getStatusColumn,
} from "./helpers";
import {
  canArchiveProfile,
  hasApiSearch,
  hasComplianceColumns,
  ProfileTypes,
} from "../../helpers";
import { useOpenProfileSidePanel } from "../../hooks/useOpenProfileSidePanel";

interface ProfilesListProps {
  readonly profiles: Profile[];
  readonly type: ProfileTypes;
}

const ProfilesList: FC<ProfilesListProps> = ({ profiles, type }) => {
  const { search } = usePageParams();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const openProfileSidePanel = useOpenProfileSidePanel();

  const filteredProfiles = useMemo(() => {
    if (!search || hasApiSearch(type)) {
      return profiles;
    }

    return profiles.filter(({ title }) =>
      title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [profiles, search, type]);

  const columns = useMemo<Column<Profile>[]>(() => {
    const { name, accessGroup, associated, actions } = getGeneralColumns(
      type,
      openProfileSidePanel,
      getAccessGroupQueryResult,
    );
    const cols = [name];

    if (canArchiveProfile(type)) {
      cols.push(getStatusColumn());
    }

    cols.push(accessGroup, associated);

    if (hasComplianceColumns(type)) {
      cols.push(...getComplianceColumns(type));
    }

    if (type === ProfileTypes.usg) {
      cols.push(...getUsgColumns());
    }

    if (type === ProfileTypes.script) {
      cols.push(...getScriptColumns());
    }

    if (type === ProfileTypes.reboot) {
      cols.push(getRebootColumn());
    }

    if (type === ProfileTypes.removal) {
      cols.push(getRemovalColumn());
    }

    cols.push(actions);

    return cols;
  }, [getAccessGroupQueryResult, openProfileSidePanel, type]);

  return (
    <ResponsiveTable
      columns={columns}
      data={filteredProfiles}
      emptyMsg={`No ${type} profiles found according to your search parameters.`}
    />
  );
};

export default ProfilesList;
