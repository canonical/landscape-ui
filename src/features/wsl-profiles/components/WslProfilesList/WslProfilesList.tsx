import ProfileAssociatedInstancesLink from "@/components/form/ProfileAssociatedInstancesLink";
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
import { getTitleByName } from "@/utils/_helpers";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { useGetWslProfiles } from "../../api";
import type { WslProfile } from "../../types";
import WslProfileNonCompliantParentsLink from "../WslProfileNonCompliantParentsLink";
import WslProfilesListActions from "../WslProfilesListActions";
import { getCellProps, getRowProps } from "./helpers";
import classes from "./WslProfilesList.module.scss";

const WslProfilesList: FC = () => {
  const { expandedRowIndex, expandedColumnId, getTableRowsRef, handleExpand } =
    useExpandableRow();
  const { search } = usePageParams();
  const { createPageParamsSetter } = usePageParams();
  const { getAccessGroupQuery } = useRoles();

  const { isGettingWslProfiles, wslProfiles } = useGetWslProfiles({ search });

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const columns = useMemo<Column<WslProfile>[]>(
    () => [
      {
        ...LIST_TITLE_COLUMN_PROPS,
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} profile title and name`,
        },
        Cell: ({ row: { original: wslProfile } }: CellProps<WslProfile>) => {
          const openWslProfileDetails = createPageParamsSetter({
            sidePath: ["view"],
            profile: wslProfile.name,
          });

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
        meta: {
          ariaLabel: (row) => `${row.original.title} profile description`,
          isExpandable: true,
        },
        Cell: ({
          row: { original: wslProfile, index },
        }: CellProps<WslProfile>) => {
          const onExpand = () => {
            handleExpand(index, "description");
          };

          return (
            <TruncatedCell
              content={wslProfile.description}
              isExpanded={
                index === expandedRowIndex && expandedColumnId === "description"
              }
              onExpand={onExpand}
            />
          );
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
        }: CellProps<WslProfile>) =>
          getTitleByName(access_group, getAccessGroupQueryResult),
      },
      {
        accessor: "tags",
        Header: "Tags",
        meta: {
          ariaLabel: ({ original }) => `${original.title} profile tags`,
          isExpandable: true,
        },
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
            handleExpand(index, "tags");
          };

          return (
            <TruncatedCell
              content={wslProfile.tags.map((tag) => (
                <span className="truncatedItem" key={tag}>
                  {tag}
                </span>
              ))}
              isExpanded={
                index === expandedRowIndex && expandedColumnId === "tags"
              }
              onExpand={onExpand}
              showCount
            />
          );
        },
      },
      {
        accessor: "computers['constrained']",
        Header: "Associated parents",
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} associated parent instances`,
        },
        Cell: ({ row: { original: wslProfile } }: CellProps<WslProfile>) => (
          <ProfileAssociatedInstancesLink
            count={wslProfile.computers.constrained.length}
            profile={wslProfile}
            query={`wsl:${wslProfile.id}`}
          />
        ),
      },
      {
        accessor: "computers['non-compliant']",
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} non compliant parent instances`,
        },
        Header: (
          <div className={classes.header}>
            Not compliant
            <Tooltip
              position="btm-left"
              message="These instances are not compliant with the profile. They do not have a pending activity to become compliant."
            >
              <Icon name="help" />
            </Tooltip>
          </div>
        ),
        Cell: ({ row: { original: wslProfile } }: CellProps<WslProfile>) => (
          <WslProfileNonCompliantParentsLink
            wslProfile={wslProfile}
            onClick={createPageParamsSetter({
              sidePath: ["noncompliant"],
              profile: wslProfile.name,
            })}
          />
        ),
      },
      {
        accessor: "computers['compliant']",
        meta: {
          ariaLabel: ({ original }) =>
            `${original.title} compliant parent instances`,
        },
        Header: (
          <div className={classes.header}>
            Compliant
            <Tooltip
              position="btm-left"
              message="These instances are compliant with the profile."
            >
              <Icon name="help" />
            </Tooltip>
          </div>
        ),
        Cell: ({ row: { original: wslProfile } }: CellProps<WslProfile>) => (
          <ProfileAssociatedInstancesLink
            profile={wslProfile}
            count={
              wslProfile.computers.constrained.length -
              wslProfile.computers["non-compliant"].length
            }
            query={`wsl:${wslProfile.id}:compliant`}
          />
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original: wslProfile } }: CellProps<WslProfile>) => (
          <WslProfilesListActions profile={wslProfile} />
        ),
      },
    ],
    [
      createPageParamsSetter,
      expandedColumnId,
      expandedRowIndex,
      getAccessGroupQueryResult,
      handleExpand,
    ],
  );

  if (isGettingWslProfiles) {
    return <LoadingState />;
  }

  return (
    <div ref={getTableRowsRef}>
      <ResponsiveTable
        columns={columns}
        data={wslProfiles}
        emptyMsg="No WSL profiles found according to your search parameters."
        getCellProps={getCellProps(expandedRowIndex, expandedColumnId)}
        getRowProps={getRowProps(expandedRowIndex)}
        minWidth={1200}
      />
    </div>
  );
};

export default WslProfilesList;
