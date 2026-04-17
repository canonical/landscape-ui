import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { Button } from "@canonical/react-components";
import { useMemo, type FC } from "react";
import type { Column, CellProps } from "react-table";
import type { LocalRepository } from "../../types";
import usePageParams from "@/hooks/usePageParams";
import LocalRepositoriesListActions from "../LocalRepositoriesListActions";
import LocalRepositoryPackagesCount from "../LocalRepositoryPackagesCount";

interface LocalRepositoriesListProps {
  readonly items: LocalRepository[];
}

const LocalRepositoriesList: FC<LocalRepositoriesListProps> = ({ items }) => {
  const { search, createPageParamsSetter } = usePageParams();

  const columns = useMemo<Column<LocalRepository>[]>(() => [
      {
        accessor: "name",
        Header: "Name",
        meta: {
          ariaLabel: ({ original: repository }) =>
            `${repository.display_name} local repository name`,
        },
        Cell: ({ row: { original: repository } }: CellProps<LocalRepository>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={createPageParamsSetter({
              sidePath: ["view"],
              repository: repository.name,
            })}
          >
            {repository.display_name}
          </Button>
        ),
      },
      {
        Header: "Description",
        meta: {
          ariaLabel: ({ original: repository }) =>
            repository.comment
              ? `${repository.display_name} profile description`
              : `No description for ${repository.display_name} profile`,
        },
        Cell: ({ row: { original: repository } }: CellProps<LocalRepository>) =>
          repository.comment || <NoData />,
      },
      {
        Header: "Packages",
        meta: {
          ariaLabel: ({ original: repository }) =>
            `${repository.display_name} local repository packages`,
        },
        Cell: ({ row: { original: repository } }: CellProps<LocalRepository>) => (
          <LocalRepositoryPackagesCount repository={repository} />
        ),
      },
      // {
      //   Header: "Publications",
      //   meta: {
      //     ariaLabel: ({ original }) => `${original.display_name} profile tags`,
      //     isExpandable: true,
      //   },
      //   Cell: ({ row: { original, index } }: CellProps<Local>) =>
      //     original.tags.length > 0 ? (
      //       <TruncatedCell
      //         content={original.tags.map((tag) => (
      //           <span className="truncatedItem" key={tag}>
      //             {tag}
      //           </span>
      //         ))}
      //         isExpanded={index == expandedRowIndex}
      //         onExpand={() => {
      //           handleExpand(index);
      //         }}
      //         showCount
      //       />
      //     ) : (
      //       <NoData />
      //     ),
      // },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        meta: {
          ariaLabel: ({ original: repository }) =>
            `"${repository.display_name}" local repository actions`,
          },
        Cell: ({ row: { original: repository } }: CellProps<LocalRepository>) => (
          <LocalRepositoriesListActions repository={repository} />
        ),
      },
    ],
    [
      createPageParamsSetter,
    ],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={items}
      emptyMsg={`No local repositories found with the search: "${search}"`}
    />
  );
};

export default LocalRepositoriesList;
