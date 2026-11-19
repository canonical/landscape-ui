import LoadingState from "@/components/layout/LoadingState";
import { ROUTES } from "@/libs/routes";
import { pluralize } from "@/utils/_helpers";
import { Icon } from "@canonical/react-components";
import { Card } from "@canonical/react-ds-global";
import type { FC } from "react";
import { useId } from "react";
import { Link } from "react-router";
import { ruleTitle } from "../../helpers";
import type { FleetTopIssue } from "../../types";
import classes from "./FleetTopIssues.module.scss";

// Rules whose mean penalty reaches this link to the critical band only.
const CRITICAL_MEAN_PENALTY = 61;
const VISIBLE_LIMIT = 5;

interface FleetTopIssuesProps {
  readonly issues?: FleetTopIssue[];
  readonly isLoading?: boolean;
  // Per rule, the change in matching instances over the last week.
  readonly changes?: Record<string, number> | null;
  readonly className?: string;
}

const FleetTopIssues: FC<FleetTopIssuesProps> = ({
  issues = [],
  isLoading,
  changes,
  className,
}) => {
  const titleId = useId();
  const visible = issues.slice(0, VISIBLE_LIMIT);
  const remaining = issues.length - visible.length;

  return (
    <Card className={className} aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="p-heading--5 u-no-margin u-no-padding">
          Top issues now
        </h2>
      </Card.Header>
      <Card.Content>
        {isLoading ? <LoadingState /> : null}
        {!isLoading && issues.length === 0 ? (
          <p className={classes.empty}>
            <Icon name="success" /> No factors are dragging the fleet down.
          </p>
        ) : null}
        {!isLoading && visible.length > 0 ? (
          <ul className={classes.list}>
            {visible.map((issue) => {
              const isCritical =
                issue.points_sum / issue.computer_count >=
                CRITICAL_MEAN_PENALTY;
              const change = changes?.[issue.rule_key] ?? 0;
              return (
                <li key={issue.rule_key} className={classes.item}>
                  <Icon name={isCritical ? "error" : "warning"} />
                  <Link
                    to={ROUTES.instances.root({
                      healthBand: isCritical
                        ? ["critical"]
                        : ["critical", "warning"],
                    })}
                    className={classes.description}
                  >
                    {ruleTitle(issue)}
                  </Link>
                  <span className={classes.count}>
                    <strong>{issue.computer_count}</strong>{" "}
                    {pluralize(issue.computer_count, ["instance"])}
                    {change === 0 ? null : (
                      <span className={classes.change}>
                        {Math.abs(change)} {change > 0 ? "more" : "fewer"} than
                        a week ago
                      </span>
                    )}
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
