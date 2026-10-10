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
import { lazy, useEffect, useMemo } from "react";
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
  const {
    name: selectedProfile,
    lastSidePathSegment,
    popSidePathUntilClear,
    closeSidePanel,
  } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsResponse } = getAccessGroupQuery();
  const { getRepositoryProfilesQuery } = useRepositoryProfiles();

  const { data, isPending, error } = getRepositoryProfilesQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search,
  });

  if (error) {
    throw error;
  }

  const profiles = data?.data.results ?? [];
  // Only a profile on the page is opened: a stale `name` (a deep link, a
  // name left behind by another profile type) must not be looked up.
  const isSelectionListed = profiles.some(
    ({ name }) => name === selectedProfile,
  );
  const hasStaleSelection =
    !isPending && !!selectedProfile && !isSelectionListed;
  const isViewing = lastSidePathSegment === "view" && isSelectionListed;

  // A selection the page no longer shows (another search or page) is
  // dropped, or it would open again as soon as the profile is listed.
  useEffect(() => {
    if (hasStaleSelection) {
      closeSidePanel();
    }
  }, [hasStaleSelection, closeSidePanel]);

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

  // The count, not the page: a page past the last one is empty too.
  if (!data?.data.count && !search) {
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
      <SidePanel onClose={popSidePathUntilClear} isOpen={isViewing}>
        {isViewing && (
          <SidePanel.Suspense key="view">
            <SupportRepositoryProfileSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default SupportRepositoryProfiles;
