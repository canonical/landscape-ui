import LoadingState from "@/components/layout/LoadingState";
import { ROUTES } from "@/libs/routes";
import { ModularTable, Select } from "@canonical/react-components";
import { Card } from "@canonical/react-ds-global";
import classNames from "classnames";
import type { FC } from "react";
import { useId, useMemo, useState } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { BAND_CRITICALITY, BAND_LABEL } from "../../helpers";
import useHealthSummaryByGroup from "../../hooks/useHealthSummaryByGroup";
import type {
  HealthBand,
  HealthGroupBy,
  HealthGroupSummary,
} from "../../types";
import classes from "./HealthByGroup.module.scss";

const OTHER_GROUP = "other";

const GROUP_OPTIONS: { label: string; value: HealthGroupBy }[] = [
  { label: "Tag", value: "tag" },
  { label: "Distribution", value: "distribution" },
];

const BANDS: HealthBand[] = ["critical", "warning", "healthy"];

const getGroupRoute = (
  row: HealthGroupSummary,
  groupBy: HealthGroupBy,
  band?: HealthBand,
): string =>
  ROUTES.instances.root({
    ...(band ? { healthBand: [band] } : {}),
    ...(groupBy === "tag" && row.group !== OTHER_GROUP
      ? { tags: [row.group] }
      : {}),
  });

interface HealthByGroupProps {
  readonly className?: string;
}

const HealthByGroup: FC<HealthByGroupProps> = ({ className }) => {
  const titleId = useId();
  const selectId = useId();
  const [groupBy, setGroupBy] = useState<HealthGroupBy>("tag");
  const { data, isLoading } = useHealthSummaryByGroup(groupBy);
  const groups = useMemo(() => data?.data.groups ?? [], [data]);

  const columns = useMemo<Column<HealthGroupSummary>[]>(
    () => [
      {
        accessor: "group",
        Header:
          GROUP_OPTIONS.find(({ value }) => value === groupBy)?.label ??
          "Group",
        Cell: ({ row: { original } }: CellProps<HealthGroupSummary>) =>
          original.group === OTHER_GROUP ? (
            "Other"
          ) : (
            <Link to={getGroupRoute(original, groupBy)}>{original.group}</Link>
          ),
      },
      {
        id: "distribution",
        Header: "Distribution",
        className: classes.distribution,
        Cell: ({ row: { original } }: CellProps<HealthGroupSummary>) => (
          <span
            className={classes.bar}
            role="img"
            aria-label={BANDS.map(
              (band) =>
                `${BAND_LABEL[band]}: ${original[`band_${band}_count`]}`,
            ).join(", ")}
          >
            {BANDS.map((band) => (
              <span
                key={band}
                className={classNames(classes.segment, BAND_CRITICALITY[band])}
                style={{ flexGrow: original[`band_${band}_count`] }}
              />
            ))}
          </span>
        ),
      },
      ...BANDS.map((band): Column<HealthGroupSummary> => ({
        id: band,
        Header: (
          <>
            <span className={classNames(classes.dot, BAND_CRITICALITY[band])} />
            {BAND_LABEL[band]}
          </>
        ),
        className: classNames(classes.count, {
          [classes.wide]: band === "warning",
        }),
        Cell: ({ row: { original } }: CellProps<HealthGroupSummary>) => (
          <span
            className={classNames({
              [classes.zero]: original[`band_${band}_count`] === 0,
            })}
          >
            {original[`band_${band}_count`]}
          </span>
        ),
      })),
      {
        accessor: "total_count",
        Header: "Total",
        className: classNames(classes.count, classes.total),
      },
    ],
    [groupBy],
  );

  return (
    <Card className={className} aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="p-heading--5 u-no-margin u-no-padding">
          Health by group
        </h2>
        <Select
          id={selectId}
          aria-label="Group by"
          wrapperClassName={classes.select}
          className="u-no-margin--bottom"
          value={groupBy}
          options={GROUP_OPTIONS}
          onChange={(event) => {
            setGroupBy(event.target.value as HealthGroupBy);
          }}
        />
      </Card.Header>
      <Card.Content>
        {isLoading ? (
          <LoadingState />
        ) : (
          <ModularTable
            className="u-no-margin--bottom"
            columns={columns}
            data={groups}
            emptyMsg="No groups to show for this dimension yet."
          />
        )}
      </Card.Content>
    </Card>
  );
};

export default HealthByGroup;
