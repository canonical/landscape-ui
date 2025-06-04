import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import {
  Button,
  Icon,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { PackageProfile } from "../../types";
import PackageProfileDetails from "../PackageProfileDetails";
import PackageProfileListActions from "../PackageProfileListActions";
import { NON_COMPLIANT_TOOLTIP, PENDING_TOOLTIP } from "./constants";
import { getCellProps, getRowProps } from "./helpers";
import classes from "./PackageProfileList.module.scss";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { pluralize } from "@/utils/_helpers";

interface PackageProfileListProps {
  readonly packageProfiles: PackageProfile[];
}

const PackageProfileList: FC<PackageProfileListProps> = ({
  packageProfiles,
}) => {
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const { expandedRowIndex, handleExpand, getTableRowsRef } =
    useExpandableRow();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const handlePackageProfileDetailsOpen = (profile: PackageProfile) => {
    setSidePanelContent(
      profile.title,
      <PackageProfileDetails profile={profile} />,
      "medium",
    );
  };

  const profiles = useMemo(() => {
    if (!search) {
      return packageProfiles;
    }

    return packageProfiles.filter((profile) => {
      return profile.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [packageProfiles, search]);

  const columns = useMemo<Column<PackageProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => {
              handlePackageProfileDetailsOpen(original);
            }}
          >
            {original.title}
          </Button>
        ),
      },
      {
        accessor: "description",
        className: classes.description,
        Header: "Description",
      },
      {
        accessor: "access_group",
        Header: "Access group",
        Cell: ({
          row: {
            original: { access_group },
          },
        }: CellProps<PackageProfile>) =>
          accessGroupOptions.find(({ value }) => value === access_group)
            ?.label ?? access_group,
      },
      {
        accessor: "tags",
        Header: "Tags",
        Cell: ({
          row: {
            original: { tags },
            index,
          },
        }: CellProps<PackageProfile>) =>
          tags.length > 0 ? (
            <TruncatedCell
              content={tags.map((tag) => (
                <span className="truncatedItem" key={tag}>
                  {tag}
                </span>
              ))}
              isExpanded={index == expandedRowIndex}
              onExpand={() => {
                handleExpand(index);
              }}
              showCount
            />
          ) : (
            <NoData />
          ),
      },
      {
        accessor: "computers['non-compliant']",
        Header: (
          <div className={classes.noWrap}>
            <span>Not compliant </span>
            <Tooltip position="btm-left" message={NON_COMPLIANT_TOOLTIP}>
              <Icon name="help" />
            </Tooltip>
          </div>
        ),
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <>
            {`${original.computers["non-compliant"].length} ${pluralize(original.computers["non-compliant"].length, "instance")}`}
          </>
        ),
      },
      {
        accessor: "computers['pending']",
        Header: (
          <div className={classes.noWrap}>
            <span>Pending </span>
            <Tooltip position="btm-left" message={PENDING_TOOLTIP}>
              <Icon name="help" />
            </Tooltip>
          </div>
        ),
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <>
            {`${original.computers["pending"]?.length ?? 0} ${pluralize(original.computers["pending"].length, "instance")}`}
          </>
        ),
      },
      {
        accessor: "computers['constrained']",
        Header: "Associated",
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <>
            {`${original.computers["constrained"].length} ${pluralize(original.computers["constrained"].length, "instance")}`}
          </>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <PackageProfileListActions profile={original} />
        ),
      },
    ],
    [accessGroupOptions.length, expandedRowIndex],
  );

  return (
    <div ref={getTableRowsRef}>
      <ModularTable
        columns={columns}
        data={profiles}
        emptyMsg={`No package profiles found with the search "${search}"`}
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
      />
    </div>
  );
};

export default PackageProfileList;
