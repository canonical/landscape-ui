import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { WslProfile } from "../../types";
import WslProfilesListActions from "../WslProfilesListActions";
import { NON_COMPLIANT_TOOLTIP, PENDING_TOOLTIP } from "./constants";
import { getCellProps, getRowProps } from "./helpers";
import classes from "./WslProfilesList.module.scss";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { pluralize } from "@/utils/_helpers";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

const WslProfileDetails = lazy(async () => import("../WslProfileDetails"));

interface WslProfileListProps {
  readonly wslProfiles: WslProfile[];
}

const WslProfilesList: FC<WslProfileListProps> = ({ wslProfiles }) => {
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const { expandedRowIndex, getTableRowsRef, handleExpand } =
    useExpandableRow();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const handleWslProfileDetailsOpen = (profile: WslProfile) => {
    setSidePanelContent(
      profile.title,
      <Suspense fallback={<LoadingState />}>
        <WslProfileDetails
          profile={profile}
          accessGroupOptions={accessGroupOptions}
        />
      </Suspense>,
    );
  };

  const profiles = useMemo(() => {
    if (!search) {
      return wslProfiles;
    }

    return wslProfiles.filter((profile) => {
      return profile.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [wslProfiles, search]);

  const columns = useMemo<Column<WslProfile>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row: { original } }: CellProps<WslProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => {
              handleWslProfileDetailsOpen(original);
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
        }: CellProps<WslProfile>) =>
          accessGroupOptions.find(({ value }) => value === access_group)
            ?.label ?? access_group,
      },
      {
        accessor: "tags",
        Header: "Tags",
        Cell: ({ row: { original, index } }: CellProps<WslProfile>) =>
          original.tags.length > 0 ? (
            <TruncatedCell
              content={original.tags.map((tag) => (
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
        Cell: ({ row: { original } }: CellProps<WslProfile>) => (
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
        Cell: ({ row: { original } }: CellProps<WslProfile>) => (
          <>
            {`${original.computers["pending"].length ?? 0} ${pluralize(original.computers["pending"].length, "instance")}`}
          </>
        ),
      },
      {
        accessor: "computers['constrained']",
        Header: "Associated",
        Cell: ({ row: { original } }: CellProps<WslProfile>) => (
          <>
            {`${original.computers["constrained"].length} ${pluralize(original.computers["constrained"].length, "instance")}`}
          </>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<WslProfile>) => (
          <WslProfilesListActions profile={original} />
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
        emptyMsg={`No WSL profiles found with the search "${search}"`}
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
        minWidth={1200}
      />
    </div>
  );
};

export default WslProfilesList;
