import useRoles from "@/hooks/useRoles";
import type { SelectOption } from "@/types/SelectOption";
import { ModularTable } from "@canonical/react-components";
import type { CellProps, Column } from "react-table";
import type { FC } from "react";
import { useMemo } from "react";
import type { RepositoryProfile } from "../../types";
import RepositoryProfileListContextualMenu from "../RepositoryProfileListContextualMenu";
import { handleCellProps } from "./helpers";
import classes from "./RepositoryProfileList.module.scss";
import NoData from "@/components/layout/NoData";

interface RepositoryProfileListProps {
  readonly repositoryProfiles: RepositoryProfile[];
}

const RepositoryProfileList: FC<RepositoryProfileListProps> = ({
  repositoryProfiles,
}) => {
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsResponse } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] = (
    accessGroupsResponse?.data ?? []
  ).map(({ name, title }) => ({
    label: title,
    value: name,
  }));

  const profiles = useMemo(() => repositoryProfiles, [repositoryProfiles]);

  const columns = useMemo<Column<RepositoryProfile>[]>(
    () => [
      {
        accessor: "title",
        Header: "Title",
      },
      {
        accessor: "description",
        Header: "Description",
        className: classes.description,
        Cell: ({ row }: CellProps<RepositoryProfile>) =>
          row.original.description || <NoData />,
      },
      {
        accessor: "access_group",
        Header: "Access group",
        className: classes.accessGroup,
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) =>
          accessGroupOptions.find(
            ({ value }) => original.access_group === value,
          )?.label ?? original.access_group,
      },
      {
        accessor: "id",
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row }: CellProps<RepositoryProfile>) => (
          <RepositoryProfileListContextualMenu profile={row.original} />
        ),
      },
    ],
    [profiles, accessGroupOptions],
  );

  return (
    <ModularTable
      columns={columns}
      data={profiles}
      getCellProps={handleCellProps}
      emptyMsg="No profiles yet."
    />
  );
};

export default RepositoryProfileList;
