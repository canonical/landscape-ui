import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ListTitle, {
  LIST_TITLE_COLUMN_PROPS,
} from "@/components/layout/ListTitle";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { useGetWslProfiles } from "../../api";
import type { WslProfile } from "../../types";
import WslProfileAssociatedParentsLink from "../WslProfileAssociatedParentsLink";
import WslProfileCompliantParentsLink from "../WslProfileCompliantParentsLink";
import WslProfileNonCompliantParentsLink from "../WslProfileNonCompliantParentsLink";
import WslProfilesListActions from "../WslProfilesListActions";
import { COMPLIANT_TOOLTIP, NON_COMPLIANT_TOOLTIP } from "./constants";
import { getCellProps, getRowProps } from "./helpers";
import classes from "./WslProfilesList.module.scss";

const WslProfileDetails = lazy(async () => import("../WslProfileDetails"));

const WslProfilesList: FC = () => {
  const { expandedRowIndex, getTableRowsRef, handleExpand } =
    useExpandableRow();
  const { search } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();

  const { isGettingWslProfiles, wslProfiles } = useGetWslProfiles({ search });

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const columns = useMemo<Column<WslProfile>[]>(
    () => [
      {
        ...LIST_TITLE_COLUMN_PROPS,
        Cell: ({ row: { original: wslProfile } }: CellProps<WslProfile>) => {
          const openWslProfileDetails = () => {
            setSidePanelContent(
              wslProfile.title,
              <Suspense fallback={<LoadingState />}>
                <WslProfileDetails
                  profile={wslProfile}
                  accessGroupOptions={accessGroupOptions}
                />
              </Suspense>,
            );
          };

          return (
            <ListTitle>
              <Button
                type="button"
                appearance="link"
                className="u-no-margin--bottom u-no-padding--top u-align--left"
                onClick={openWslProfileDetails}
              >
                {wslProfile.title}
              </Button>

              <span className="u-text--muted">{wslProfile.name}</span>
            </ListTitle>
          );
        },
      },
      {
        accessor: "description",
        className: classes.description,
        Header: "Description",
        Cell: ({
          row: { original: wslProfile, index },
        }: CellProps<WslProfile>) => {
          const onExpand = () => {
            handleExpand(index);
          };

          return (
            <TruncatedCell
              content={wslProfile.description}
              isExpanded={index === expandedRowIndex}
              onExpand={onExpand}
            />
          );
        },
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
        Cell: ({
          row: { original: wslProfile, index },
        }: CellProps<WslProfile>) => {
          if (wslProfile.all_computers) {
            return "All instances";
          }

          if (!wslProfile.tags.length) {
            return <NoData />;
          }

          const onExpand = () => {
            handleExpand(index);
          };

          return (
            <TruncatedCell
              content={wslProfile.tags.map((tag) => (
                <span className="truncatedItem" key={tag}>
                  {tag}
                </span>
              ))}
              isExpanded={index === expandedRowIndex}
              onExpand={onExpand}
              showCount
            />
          );
        },
      },
      {
        accessor: "computers['constrained']",
        Header: "Associated parents",
        Cell: ({ row: { original: wslProfile } }: CellProps<WslProfile>) => (
          <WslProfileAssociatedParentsLink wslProfile={wslProfile} />
        ),
      },
      {
        accessor: "computers['non-compliant']",
        Header: (
          <div className={classes.header}>
            Not compliant
            <Tooltip position="btm-left" message={NON_COMPLIANT_TOOLTIP}>
              <Icon name="help" />
            </Tooltip>
          </div>
        ),
        Cell: ({ row: { original: wslProfile } }: CellProps<WslProfile>) => (
          <WslProfileNonCompliantParentsLink wslProfile={wslProfile} />
        ),
      },
      {
        accessor: "computers['compliant']",
        Header: (
          <div className={classes.header}>
            Compliant
            <Tooltip position="btm-left" message={COMPLIANT_TOOLTIP}>
              <Icon name="help" />
            </Tooltip>
          </div>
        ),
        Cell: ({ row: { original: wslProfile } }: CellProps<WslProfile>) => (
          <WslProfileCompliantParentsLink wslProfile={wslProfile} />
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original: wslProfile } }: CellProps<WslProfile>) => (
          <WslProfilesListActions profile={wslProfile} />
        ),
      },
    ],
    [accessGroupOptions.length, expandedRowIndex],
  );

  if (isGettingWslProfiles) {
    return <LoadingState />;
  }

  return (
    <div ref={getTableRowsRef}>
      <ResponsiveTable
        columns={columns}
        data={wslProfiles}
        emptyMsg={`No WSL profiles found according to your search parameters.`}
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
        minWidth={1200}
      />
    </div>
  );
};

export default WslProfilesList;
