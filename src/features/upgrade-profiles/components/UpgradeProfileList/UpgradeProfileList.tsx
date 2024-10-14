import LoadingState from "@/components/layout/LoadingState";
import { usePageParams } from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import { Button, ModularTable } from "@canonical/react-components";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import { FC, lazy, Suspense, useMemo } from "react";
import { UpgradeProfile } from "../../types";
import UpgradeProfileListContextualMenu from "../UpgradeProfileListContextualMenu";
import classes from "./UpgradeProfileList.module.scss";

const UpgradeProfileDetails = lazy(() => import("../UpgradeProfileDetails"));

interface UpgradeProfileListProps {
  profiles: UpgradeProfile[];
}

const UpgradeProfileList: FC<UpgradeProfileListProps> = ({ profiles }) => {
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const filteredProfiles = useMemo(() => {
    if (!search) {
      return profiles;
    }

    return profiles.filter((profile) => {
      return profile.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [profiles, search]);

  const handleUpgradeProfileDetailsOpen = (profile: UpgradeProfile) => {
    setSidePanelContent(
      profile.title,
      <Suspense fallback={<LoadingState />}>
        <UpgradeProfileDetails
          accessGroupOptions={accessGroupOptions}
          profile={profile}
        />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<UpgradeProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => handleUpgradeProfileDetailsOpen(original)}
          >
            {original.title}
          </Button>
        ),
      },
      {
        accessor: "access_group",
        Header: "Access group",
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <>
            {accessGroupOptions.find(
              ({ value }) => value === original.access_group,
            )?.label ?? original.access_group}
          </>
        ),
      },
      {
        accessor: "tags",
        className: classes.truncated,
        Header: "Tags",
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <>{original.tags.join(", ")}</>
        ),
      },
      {
        accessor: "associated",
        Header: "Associated",
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<UpgradeProfile>) => (
          <UpgradeProfileListContextualMenu profile={original} />
        ),
      },
    ],
    [filteredProfiles, accessGroupOptions.length],
  );

  return (
    <ModularTable
      columns={columns}
      data={filteredProfiles}
      emptyMsg={`No profiles found with the search: "${search}"`}
    />
  );
};

export default UpgradeProfileList;
