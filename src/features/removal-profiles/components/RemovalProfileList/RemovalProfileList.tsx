import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, ModularTable } from "@canonical/react-components";
import type { CellProps, Column } from "react-table";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import type { RemovalProfile } from "../../types";
import RemovalProfileListContextualMenu from "../RemovalProfileListContextualMenu";
import classes from "./RemovalProfileList.module.scss";
import NoData from "@/components/layout/NoData";

const RemovalProfileDetails = lazy(() => import("../RemovalProfileDetails"));

interface RemovalProfileListProps {
  readonly profiles: RemovalProfile[];
}

const RemovalProfileList: FC<RemovalProfileListProps> = ({ profiles }) => {
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions =
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

  const handleRemovalProfileDetailsOpen = (profile: RemovalProfile) => {
    setSidePanelContent(
      profile.title,
      <Suspense fallback={<LoadingState />}>
        <RemovalProfileDetails
          accessGroupOptions={accessGroupOptions}
          profile={profile}
        />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<RemovalProfile>[]>(
    () => [
      {
        accessor: "title",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <Button
            type="button"
            appearance="link"
            onClick={() => handleRemovalProfileDetailsOpen(original)}
            className="u-no-margin--bottom u-no-padding--top"
            aria-label={`Open "${original.title}" profile details`}
          >
            {original.title}
          </Button>
        ),
      },
      {
        accessor: "access_group",
        Header: "Access group",
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <>
            {accessGroupOptions.find(
              (option) => option.value === original.access_group,
            )?.label ?? original.access_group}
          </>
        ),
      },
      {
        accessor: "tags",
        className: classes.truncated,
        Header: "Tags",
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) =>
          original.tags.join(", ") || <NoData />,
      },
      {
        accessor: "associated",
        Header: "Associated",
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<RemovalProfile>) => (
          <RemovalProfileListContextualMenu profile={original} />
        ),
      },
    ],
    [filteredProfiles],
  );

  return (
    <ModularTable
      columns={columns}
      data={filteredProfiles}
      emptyMsg={`No removal profiles found with the search: "${search}"`}
    />
  );
};

export default RemovalProfileList;
