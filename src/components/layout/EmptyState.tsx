import type { FC, ReactNode } from "react";
import classes from "./EmptyState.module.scss";
import classNames from "classnames";

interface EmptyStateProps {
  readonly title?: string;
  readonly body?: ReactNode;
  readonly link?: { href: string; text: string };
  readonly icon?: string;
  readonly cta?: ReactNode[];
  readonly className?: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  title = "",
  body = "",
  link,
  icon = "",
  cta = [],
  className,
}) => {
  return (
    <div className={classNames("p-strip", classes.inner, className)}>
      {icon && (
        <div>
          <span
            style={{ width: 36, height: 36, opacity: 0.2 }}
            className={`p-icon--${icon}`}
            aria-hidden
          />
        </div>
      )}
      {title && <p className="p-heading--4 u-no-margin">{title}</p>}
      {body && <div className={classes.body}>{body}</div>}
      {link && (
        <a href={link.href} target="_blank" rel="nofollow noopener noreferrer">
          {link.text}
        </a>
      )}
      {cta.length > 0 && <div className={classes.cta}>{cta}</div>}
    </div>
  );
};

export default EmptyState;
