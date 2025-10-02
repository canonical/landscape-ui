import ProfileAssociatedInstancesLink from "@/components/form/ProfileAssociatedInstancesLink";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ListTitle, {
  LIST_TITLE_COLUMN_PROPS,
} from "@/components/layout/ListTitle";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import type { SelectOption } from "@/types/SelectOption";
import { pluralize } from "@/utils/_helpers";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { PackageProfile } from "../../types";
import PackageProfileListActions from "../PackageProfileListActions";
import { NON_COMPLIANT_TOOLTIP, PENDING_TOOLTIP } from "./constants";
import { getCellProps, getRowProps } from "./helpers";
import classes from "./PackageProfileList.module.scss";

interface PackageProfileListProps {
  readonly packageProfiles: PackageProfile[];
}

const PackageProfileList: FC<PackageProfileListProps> = ({
  packageProfiles,
}) => {
  const { search, createPageParamsSetter } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { expandedRowIndex, handleExpand, getTableRowsRef } =
    useExpandableRow();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

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
        ...LIST_TITLE_COLUMN_PROPS,
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile title and name`,
        },
        Cell: ({ row: { original } }: CellProps<PackageProfile>) => (
          <ListTitle>
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top u-align-text--left"
              onClick={createPageParamsSetter({
                sidePath: ["view"],
                profile: original.name,
              })}
            >
              {original.title}
            </Button>

            <span className="u-text--muted">{original.name}</span>
          </ListTitle>
        ),
      },
      {
        accessor: "description",
        className: classes.description,
        Header: "Description",
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile description`,
        },
      },
      {
        accessor: "access_group",
        Header: "Access group",
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile access group`,
        },
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
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile tags`,
          isExpandable: true,
        },
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
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile non-compliant instances`,
        },
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
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile pending instances`,
        },
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
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile constrained instances`,
        },
        Header: "Associated",
        Cell: ({
          row: { original: packageProfile },
        }: CellProps<PackageProfile>) => (
          <ProfileAssociatedInstancesLink
            profile={packageProfile}
            count={packageProfile.computers.constrained.length}
            query={`package:${packageProfile.id}`}
          />
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
      <ResponsiveTable
        columns={columns}
        data={profiles}
        emptyMsg={`No package profiles found with the search "${search}"`}
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
        minWidth={1200}
      />
    </div>
  );
};

export default PackageProfileList;
