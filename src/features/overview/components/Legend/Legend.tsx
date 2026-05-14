import classNames from "classnames";
import type { FC } from "react";
import { Link } from "react-router";
import { ALERT_STATUSES } from "@/features/instances";
import { ROUTES } from "@/libs/routes";
import { pluralizeWithCount } from "@/utils/_helpers";
import classes from "./Legend.module.scss";

export interface LegendItem {
  readonly label: string;
  readonly count: number;
}

interface LegendProps {
  readonly items: readonly LegendItem[];
  readonly selectedArc: number | null;
  readonly onArcEnter: (index: number) => void;
  readonly onArcLeave: () => void;
}

const DIMMED_OPACITY = 0.55;

const Legend: FC<LegendProps> = ({
  items,
  selectedArc,
  onArcEnter,
  onArcLeave,
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={classes.container} onMouseLeave={onArcLeave}>
      {items.map((item, index) => {
        const statusItem =
          Object.values(ALERT_STATUSES).find(
            (status) => status?.alternateLabel === item.label,
          ) ?? ALERT_STATUSES["Unknown"];

        const isActive = selectedArc === index;
        const isDimmed = selectedArc !== null && !isActive;

        return (
          <div
            key={item.label}
            className={classNames(
              "u-no-padding u-no-margin",
              classes.legendItem,
              {
                [classes["legendItem--active"]]: isActive,
              },
            )}
            style={{ opacity: isDimmed ? DIMMED_OPACITY : 1 }}
            aria-current={isActive ? "true" : undefined}
            onMouseEnter={() => {
              onArcEnter(index);
            }}
            onFocus={() => {
              onArcEnter(index);
            }}
            onBlur={onArcLeave}
          >
            <div className={classes.legendItem__label}>
              <i
                className={classNames(
                  `p-icon--${statusItem.icon.color}`,
                  classes.legendItem__icon,
                )}
                aria-hidden="true"
              />
              <span className={classes.legendItem__text}>{item.label}</span>
            </div>
            {item.count === 0 ? (
              <span className="u-no-margin u-no-padding">
                {pluralizeWithCount(item.count, "instance")}
              </span>
            ) : (
              <Link
                to={ROUTES.instances.root({ status: statusItem.filterValue })}
                className="u-no-margin u-no-padding"
              >
                {pluralizeWithCount(item.count, "instance")}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Legend;
