import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ListTitle, {
  LIST_TITLE_COLUMN_PROPS,
} from "@/components/layout/ListTitle";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { RepositoryProfile } from "../../types";
import RepositoryProfileListActions from "../RepositoryProfileListActions";
import { getCellProps, getRowProps } from "./helpers";
import classes from "./RepositoryProfileList.module.scss";

interface RepositoryProfileListProps {
  readonly repositoryProfiles: RepositoryProfile[];
}

const RepositoryProfileList: FC<RepositoryProfileListProps> = ({
  repositoryProfiles,
}) => {
  const { search } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsResponse } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] = (
    accessGroupsResponse?.data ?? []
  ).map(({ name, title }) => ({
    label: title,
    value: name,
  }));

  const profiles = useMemo(() => {
    if (!search) {
      return repositoryProfiles;
    }

    return repositoryProfiles.filter((profile) => {
      return profile.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [repositoryProfiles, search]);

  const columns = useMemo<Column<RepositoryProfile>[]>(
    () => [
      {
        ...LIST_TITLE_COLUMN_PROPS,
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile title and name`,
        },
        Cell: ({ row }: CellProps<RepositoryProfile>) => (
          <ListTitle>
            {row.original.title}
            <span className="u-text--muted">{row.original.name}</span>
          </ListTitle>
        ),
      },
      {
        accessor: "description",
        Header: "Description",
        className: classes.description,
        meta: {
          ariaLabel: ({ original }) =>
            original.description
              ? `${original.title} profile description`
              : `No description for ${original.title} profile`,
        },
        Cell: ({ row }: CellProps<RepositoryProfile>) =>
          row.original.description || <NoData />,
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
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<RepositoryProfile>) => (
          <RepositoryProfileListActions profile={row.original} />
        ),
      },
    ],
    [accessGroupOptions],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={profiles}
      getCellProps={getCellProps()}
      getRowProps={getRowProps()}
      emptyMsg={`No repository profiles found with the search "${search}"`}
    />
  );
};

export default RepositoryProfileList;
