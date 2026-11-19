import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { useGetInstances } from "@/features/instances";
import { ROUTES } from "@/libs/routes";
import type { Instance } from "@/types/Instance";
import { ModularTable } from "@canonical/react-components";
import { Card } from "@canonical/react-ds-global";
import type { FC } from "react";
import { useId, useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { CRITICAL_FACTOR_POINTS, ruleTitle } from "../../helpers";
import type { HealthFactor, MeasuredComputerHealth } from "../../types";
import HealthScore from "../HealthScore";
import classes from "./TopDetractors.module.scss";

const VISIBLE_LIMIT = 5;

/** Returns the instance's health state when it has a score. */
const measuredHealth = ({
  health,
}: Instance): MeasuredComputerHealth | undefined =>
  health?.measurable ? (health as MeasuredComputerHealth) : undefined;

const getDominantFactor = (instance: Instance): HealthFactor | undefined =>
  [...(measuredHealth(instance)?.factors ?? [])].sort(
    (a, b) => b.points - a.points,
  )[0];

interface TopDetractorsProps {
  readonly className?: string;
}

const TopDetractors: FC<TopDetractorsProps> = ({ className }) => {
  const titleId = useId();
  const { instances, isGettingInstances } = useGetInstances({
    limit: VISIBLE_LIMIT,
    health_band: "critical,warning",
    with_health: true,
    // The server orders worst first, so one short page is the whole list.
    sort: "health",
  });

  const worstInstances = useMemo(
    () => instances.filter((instance) => measuredHealth(instance)),
    [instances],
  );

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        id: "score",
        Header: "Score",
        className: classes.score,
        Cell: ({ row: { original } }: CellProps<Instance>) => {
          const health = measuredHealth(original);
          return health ? (
            <HealthScore score={health.score} band={health.band} />
          ) : (
            <NoData />
          );
        },
      },
      {
        accessor: "title",
        Header: "Instance",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <Link to={ROUTES.instances.details.single(original.id)}>
            {original.title}
          </Link>
        ),
      },
      {
        id: "factor",
        Header: "Main factor",
        Cell: ({ row: { original } }: CellProps<Instance>) => {
          const factor = getDominantFactor(original);
          return factor ? (
            <>
              {ruleTitle(factor)}{" "}
              <span className={classes.points}>
                {factor.points >= CRITICAL_FACTOR_POINTS
                  ? "Sets score to 0"
                  : `−${factor.points} points`}
              </span>
            </>
          ) : (
            <NoData />
          );
        },
      },
    ],
    [],
  );

  return (
    <Card className={className} aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="p-heading--5 u-no-margin u-no-padding">
          Top detractors
        </h2>
      </Card.Header>
      <Card.Content>
        {isGettingInstances ? (
          <LoadingState />
        ) : (
          <ModularTable
            className="u-no-margin--bottom"
            columns={columns}
            data={worstInstances}
            emptyMsg="No instances in the warning or critical band."
          />
        )}
      </Card.Content>
    </Card>
  );
};

export default TopDetractors;
