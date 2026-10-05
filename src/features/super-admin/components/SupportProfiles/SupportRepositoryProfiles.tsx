import ListTitle, {
  LIST_TITLE_COLUMN_PROPS,
} from "@/components/layout/ListTitle";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import SidePanel from "@/components/layout/SidePanel";
import { TablePagination } from "@/components/layout/TablePagination";
import { ProfilesHeader, ProfileTypes } from "@/features/profiles";
import {
  type RepositoryProfile,
  useRepositoryProfiles,
} from "@/features/repository-profiles";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getTitleByName, pluralize } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, useMemo } from "react";
import type { CellProps, Column } from "react-table";

const SupportRepositoryProfileSidePanel = lazy(
  async () => import("./SupportRepositoryProfileSidePanel"),
);

/**
 * The account's repository profiles, read-only. Unlike the other profiles
 * these are searched and paginated by the server.
 */
const SupportRepositoryProfiles: FC = () => {
  const { currentPage, pageSize, search, createPageParamsSetter } =
    usePageParams();
  const { lastSidePathSegment, popSidePathUntilClear } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsResponse } = getAccessGroupQuery();
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();

  const { data, isPending } = getRepositoryProfilesQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search,
  });

  const profiles = data?.data.results ?? [];

  const columns = useMemo<Column<RepositoryProfile>[]>(
    () => [
      {
        ...LIST_TITLE_COLUMN_PROPS,
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile title and name`,
        },
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) => (
          <ListTitle>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top u-align--left"
              onClick={createPageParamsSetter({
                sidePath: ["view"],
                name: original.name,
              })}
            >
              {original.title}
            </Button>
          </ListTitle>
        ),
      },
      {
        accessor: "access_group",
        Header: "Access group",
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile access group`,
        },
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) =>
          getTitleByName(original.access_group, accessGroupsResponse),
      },
      {
        accessor: "pending_count",
        Header: "Pending",
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile pending machines count`,
        },
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) =>
          pluralize(original.pending_count, ["instance"], "exact"),
      },
    ],
    [accessGroupsResponse, createPageParamsSetter],
  );

  if (isPending) {
    return <LoadingState />;
  }

  if (!profiles.length && !search) {
    return <EmptyState title="This account has no repository profiles." />;
  }

  return (
    <>
      <ProfilesHeader type={ProfileTypes.repository} />
      <ResponsiveTable
        columns={columns}
        data={profiles}
        emptyMsg={`No repository profiles found with the search "${search}"`}
      />
      <TablePagination
        totalItems={data?.data.count}
        currentItemCount={profiles.length}
      />
      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={lastSidePathSegment === "view"}
      >
        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <SupportRepositoryProfileSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default SupportRepositoryProfiles;
