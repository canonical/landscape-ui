import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ListTitle, {
  LIST_TITLE_COLUMN_PROPS,
} from "@/components/layout/ListTitle";
import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { Suspense, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { RepositoryProfile } from "../../types";
import RepositoryProfileListActions from "../RepositoryProfileListActions";
import { getCellProps, getRowProps } from "./helpers";
import classes from "./RepositoryProfileList.module.scss";
import RepositoryProfileDetails from "../RepositoryProfileDetails";

interface RepositoryProfileListProps {
  readonly repositoryProfiles: RepositoryProfile[];
}

const RepositoryProfileList: FC<RepositoryProfileListProps> = ({
  repositoryProfiles,
}) => {
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
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
    () => {
      const handleViewRepository = (profile: RepositoryProfile): void => {
        setSidePanelContent(
          profile.title,
          <Suspense fallback={<LoadingState />}>
            <RepositoryProfileDetails profile={profile} />
          </Suspense>,
        );
      };
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
              onClick={() => { handleViewRepository(original); }}
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
          ariaLabel: ({ original }) => `${original.title} profile associated machines count`,
        },
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) =>
          accessGroupOptions.find(
            ({ value }) => original.access_group === value,
          )?.label ?? original.access_group,
      },
      {
        accessor: "compliant",
        Header: "Compliant",
        className: classes.compliant,
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile compliant machines count`,
        },
        Cell: ({ row: { original } }: CellProps<RepositoryProfile>) =>
          accessGroupOptions.find(
            ({ value }) => original.access_group === value,
          )?.label ?? original.access_group,
      },
      {
        accessor: "notCompliant",
        Header: "Not Compliant",
        className: classes.notCompliant,
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile not compliant machines count`,
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
    ];
  },
    [accessGroupOptions, setSidePanelContent],
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
