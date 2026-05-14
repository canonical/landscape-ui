import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ListTitle, {
  LIST_TITLE_COLUMN_PROPS,
} from "@/components/layout/ListTitle";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { SelectOption } from "@/types/SelectOption";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { RepositoryProfile } from "../../types";
import { useGetProfileInstancesCount } from "../../api";
import RepositoryProfileListActions from "../RepositoryProfileListActions";
import { getCellProps, getRowProps } from "./helpers";
import classes from "./RepositoryProfileList.module.scss";
import { ProfileAssociatedInstancesLink } from "@/features/profiles";
import { pluralizeWithCount } from "@/utils/_helpers";

const AssociatedCountCell: FC<{ readonly profile: RepositoryProfile }> = ({
  profile,
}) => {
  const { associatedCount, isLoadingCount } = useGetProfileInstancesCount(
    profile.id,
  );
  return (
    <ProfileAssociatedInstancesLink
      profile={profile}
      count={associatedCount}
      query={`repository:${profile.id}`}
      isPending={isLoadingCount}
      isGeneralAssociation
    />
  );
};

interface RepositoryProfileListProps {
  readonly repositoryProfiles: RepositoryProfile[];
  readonly totalCount?: number;
}

const RepositoryProfileList: FC<RepositoryProfileListProps> = ({
  repositoryProfiles,
  totalCount = 0,
}) => {
  const { search, createPageParamsSetter } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsResponse } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] = (
    accessGroupsResponse?.data ?? []
  ).map(({ name, title }) => ({
    label: title,
    value: name,
  }));

  const columns = useMemo<Column<RepositoryProfile>[]>(() => {
    return [
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
        className: classes.accessGroup,
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile access group`,
        },
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) =>
          accessGroupOptions.find(
            ({ value }) => original.access_group === value,
          )?.label ?? original.access_group,
      },
      {
        accessor: "associated",
        Header: "Associated",
        className: classes.associated,
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile associated machines count`,
        },
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) => (
          <AssociatedCountCell profile={original} />
        ),
      },
      {
        accessor: "applied_count",
        Header: "Applied",
        className: classes.applied,
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile applied machines count`,
        },
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) => (
          <>{pluralizeWithCount(original.applied_count ?? 0, "instance")}</>
        ),
      },
      {
        accessor: "pending_count",
        Header: "Pending",
        className: classes.pending,
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile pending machines count`,
        },
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) => (
          <>{pluralizeWithCount(original.pending_count ?? 0, "instance")}</>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<RepositoryProfile>) => (
          <RepositoryProfileListActions profile={row.original} />
        ),
      },
    ];
  }, [accessGroupOptions, createPageParamsSetter]);

  return (
    <>
      <ResponsiveTable
        columns={columns}
        data={repositoryProfiles}
        getCellProps={getCellProps()}
        getRowProps={getRowProps()}
        emptyMsg={`No repository profiles found with the search "${search}"`}
      />
      <TablePagination
        totalItems={totalCount}
        currentItemCount={repositoryProfiles.length}
      />
    </>
  );
};

export default RepositoryProfileList;
