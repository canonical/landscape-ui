import type { FC, ReactNode } from "react";
import classNames from "classnames";
import classes from "./EmptyState.module.scss";
import { COMMON_NUMBERS } from "@/constants";

interface EmptyStateProps {
  readonly title?: string;
  readonly body?: ReactNode;
  readonly icon?: string;
  readonly cta?: ReactNode[];
  readonly size?: "medium" | "large";
}

const EmptyState: FC<EmptyStateProps> = ({
  title = "",
  body = "",
  icon = "",
  cta = [],
  size = "medium",
}) => {
  return (
    <div className="p-strip">
      <div className="u-fixed-width">
        <div className={`${classes.inner} size-${size}`}>
          {icon && (
            <div>
              <span
                style={{ width: 36, height: 36, opacity: 0.2 }}
                className={`p-icon--${icon}`}
                aria-hidden
              />
            </div>
          )}
          {title && (
            <p
              className={classNames("p-heading--4", {
                "u-no-margin--bottom": Boolean(body),
              })}
            >
              {title}
            </p>
          )}
          {body && <div>{body}</div>}
          {cta.length > COMMON_NUMBERS.ZERO && (
            <div className={classes.cta}>{cta}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
