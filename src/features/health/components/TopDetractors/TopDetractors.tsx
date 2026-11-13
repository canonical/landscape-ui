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
import { CRITICAL_FACTOR_POINTS } from "../../helpers";
import type { HealthFactor } from "../../types";
import HealthScore from "../HealthScore";
import classes from "./TopDetractors.module.scss";

const VISIBLE_LIMIT = 5;
const FETCH_LIMIT = 25;
const MAX_SCORE = 100;

const getDominantFactor = (instance: Instance): HealthFactor | undefined =>
  [...(instance.health?.factors ?? [])].sort((a, b) => b.points - a.points)[0];

interface TopDetractorsProps {
  readonly className?: string;
}

const TopDetractors: FC<TopDetractorsProps> = ({ className }) => {
  const titleId = useId();
  const { instances, isGettingInstances } = useGetInstances({
    limit: FETCH_LIMIT,
    health_band: "critical,warning",
    with_health: true,
  });

  const worstInstances = useMemo(
    () =>
      instances
        .filter(({ health }) => health !== undefined)
        .sort(
          (a, b) =>
            (a.health?.score ?? MAX_SCORE) - (b.health?.score ?? MAX_SCORE) ||
            (b.health?.critical_factor_count ?? 0) -
              (a.health?.critical_factor_count ?? 0),
        )
        .slice(0, VISIBLE_LIMIT),
    [instances],
  );

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        id: "score",
        Header: "Score",
        className: classes.score,
        Cell: ({ row: { original } }: CellProps<Instance>) =>
          original.health ? (
            <HealthScore
              score={original.health.score}
              band={original.health.band}
            />
          ) : (
            <NoData />
          ),
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
              {factor.description}{" "}
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
