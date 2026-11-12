import LoadingState from "@/components/layout/LoadingState";
import { ROUTES } from "@/libs/routes";
import { pluralize } from "@/utils/_helpers";
import { Icon } from "@canonical/react-components";
import { Card } from "@canonical/react-ds-global";
import type { FC } from "react";
import { useId } from "react";
import { Link } from "react-router";
import type { FleetTopDetractor } from "../../types";
import classes from "./FleetTopIssues.module.scss";

// Rules at or above this weight link to the critical band only.
const CRITICAL_WEIGHT = 61;
const VISIBLE_LIMIT = 5;

interface FleetTopIssuesProps {
  readonly detractors?: FleetTopDetractor[];
  readonly isLoading?: boolean;
  readonly className?: string;
}

const FleetTopIssues: FC<FleetTopIssuesProps> = ({
  detractors = [],
  isLoading,
  className,
}) => {
  const titleId = useId();
  const visible = detractors.slice(0, VISIBLE_LIMIT);
  const remaining = detractors.length - visible.length;

  return (
    <Card className={className} aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="p-heading--5 u-no-margin u-no-padding">
          Top issues now
        </h2>
      </Card.Header>
      <Card.Content>
        {isLoading ? <LoadingState /> : null}
        {!isLoading && detractors.length === 0 ? (
          <p className={classes.empty}>
            <Icon name="success" /> No factors are dragging the fleet down.
          </p>
        ) : null}
        {!isLoading && visible.length > 0 ? (
          <ul className={classes.list}>
            {visible.map((detractor) => {
              const isCritical = detractor.weight >= CRITICAL_WEIGHT;
              return (
                <li key={detractor.rule_id} className={classes.item}>
                  <Icon name={isCritical ? "error" : "warning"} />
                  <Link
                    to={ROUTES.instances.root({
                      healthBand: isCritical
                        ? ["critical"]
                        : ["critical", "warning"],
                    })}
                    className={classes.description}
                  >
                    {detractor.description}
                  </Link>
                  <span className={classes.count}>
                    <strong>{detractor.computer_count}</strong>{" "}
                    {pluralize(detractor.computer_count, ["instance"])}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </Card.Content>
      {!isLoading && remaining > 0 ? (
        <Card.Footer>
          <Link
            to={ROUTES.instances.root({ healthBand: ["critical", "warning"] })}
          >
            View {remaining} more {pluralize(remaining, ["issue"])}
          </Link>
        </Card.Footer>
      ) : null}
    </Card>
  );
};

export default FleetTopIssues;
