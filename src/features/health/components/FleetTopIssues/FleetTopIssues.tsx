// LA061 Phase 1.8: Top Issues Now widget. Standalone card extracted from
// the FleetHealthWidget's old third column so the Overview can lay it out
// as a sibling (2/3 hero + 1/3 top issues) instead of cramming three
// columns into one card.
//
// Each row reads "{title} / {description}" with the instance count as a
// right-aligned chip and a chevron deep-link to the instance list filtered
// to the right band(s). Legacy rows without a `title` (server pre-LA061-
// title) fall back to using `description` as the heading.
//
// The card stretches to match the Fleet health hero's height on wide
// viewports and the list scrolls when there are more detractors than fit.

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
      {!isLoading && rows.length > 0 && (
        <ul className={classes.list}>
          {rows.map((d) => {
            const isCritical = d.weight >= HEALTHY_FLOOR;
            // Title is the row heading; fall back to description on legacy
            // rules where the server hasn't been migrated yet (title === "").
            const rowTitle = d.title || d.description;
            // Suppress the description line when title === description (the
            // fallback case) so we don't double-render the same text.
            const rowDetail = d.title && d.title !== d.description
              ? d.description
              : null;
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
                  <Icon name={isCritical ? "error" : "warning"} />
                  <span className={classes.body}>
                    <span className={classes.title}>{rowTitle}</span>
                    {rowDetail && (
                      <span className={classes.detail}>{rowDetail}</span>
                    )}
                  </span>
                  <span
                    className={classNames(classes.countChip, {
                      [classes.countChipCritical]: isCritical,
                    })}
                    aria-label={`${d.computer_count} ${d.computer_count === 1 ? "instance" : "instances"}`}
                  >
                    {d.computer_count}
                  </span>
                  <Icon name="chevron-right" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default FleetTopIssues;
