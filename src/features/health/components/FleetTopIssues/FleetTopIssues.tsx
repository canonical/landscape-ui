// LA061 Phase 1.8: Top Issues Now widget. Standalone card extracted from
// the FleetHealthWidget's old third column so the Overview can lay it out
// as a sibling (2/3 hero + 1/3 top issues) instead of cramming three
// columns into one card.
//
// Renders the same rule-by-rule rollup the hero used to: one row per
// detractor with a count + description + chevron, plus a deep-link to the
// instance list pre-filtered to the right band(s).

import { ROUTES } from "@/libs/routes";
import { Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { Link } from "react-router";
import type { FleetTopDetractor } from "../../types";
import classes from "./FleetTopIssues.module.scss";

// Mirror the hero's threshold: critical-weight rules link only to the
// critical-band instance list; everything else gets warning + critical.
const HEALTHY_FLOOR = 61;
// LA061 Phase 1.8: bound the visible list so the card height stays
// predictable next to the 2fr Fleet health hero. The remaining detractors
// are reachable via the "View all issues" link in the footer.
const VISIBLE_LIMIT = 5;

interface FleetTopIssuesProps {
  readonly detractors?: FleetTopDetractor[];
  readonly isLoading?: boolean;
  readonly heading?: string;
}

const FleetTopIssues: FC<FleetTopIssuesProps> = ({
  detractors,
  isLoading,
  heading = "Top issues now",
}) => {
  const rows = detractors ?? [];
  const visible = rows.slice(0, VISIBLE_LIMIT);
  const remaining = Math.max(0, rows.length - visible.length);
  return (
    <section className={classes.container}>
      <p className="p-heading--5 u-no-margin--bottom">{heading}</p>
      {isLoading && (
        <p className={classes.detail}>Loading…</p>
      )}
      {!isLoading && rows.length === 0 && (
        <p className={classes.empty}>
          <Icon name="success" /> No factors are dragging the fleet down.
        </p>
      )}
      {!isLoading && visible.length > 0 && (
        <ul className={classes.list}>
          {visible.map((d) => {
            const isCritical = d.weight >= HEALTHY_FLOOR;
            return (
              <li key={d.rule_id}>
                <Link
                  to={ROUTES.instances.root({
                    healthBand: isCritical
                      ? ["critical"]
                      : ["critical", "warning"],
                  })}
                  className={classes.row}
                >
                  <span
                    className={classNames(classes.icon, {
                      [classes.iconCritical]: isCritical,
                    })}
                    aria-hidden="true"
                  >
                    <Icon name={isCritical ? "error" : "warning"} />
                  </span>
                  <span className={classes.body}>
                    <span className={classes.count}>
                      {d.computer_count}{" "}
                      {d.computer_count === 1 ? "instance" : "instances"}
                    </span>
                    <span className={classes.detail}>{d.description}</span>
                  </span>
                  <Icon name="chevron-right" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {!isLoading && remaining > 0 && (
        <Link
          className={classes.viewAll}
          to={ROUTES.instances.root({ healthBand: ["critical", "warning"] })}
        >
          View {remaining} more issue{remaining === 1 ? "" : "s"}
        </Link>
      )}
    </section>
  );
};

export default FleetTopIssues;
