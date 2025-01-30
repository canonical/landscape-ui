import type { FC, ReactNode } from "react";
import classNames from "classnames";
import classes from "./EmptyState.module.scss";

interface EmptyStateProps {
  readonly title?: string;
  readonly body?: ReactNode;
  readonly icon?: string;
  readonly cta?: ReactNode[];
}

const EmptyState: FC<EmptyStateProps> = ({
  title = "",
  body = "",
  icon = "",
  cta = [],
}) => {
  return (
    <div className="p-strip">
      <div className="u-fixed-width">
        <div className={classes.inner}>
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
          {cta.length > 0 && <div className={classes.cta}>{cta}</div>}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
