import type { FC, ReactNode } from "react";
import classes from "./EmptyState.module.scss";

interface EmptyStateProps {
  readonly title?: string;
  readonly body?: ReactNode;
  readonly link?: { href: string; text: string };
  readonly icon?: string;
  readonly cta?: ReactNode[];
  readonly size?: "fixed" | "max";
}

const EmptyState: FC<EmptyStateProps> = ({
  title = "",
  body = "",
  link,
  icon = "",
  cta = [],
  size = "fixed",
}) => {
  return (
    <div className="p-strip">
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
        {title && <p className="p-heading--4 u-no-margin">{title}</p>}
        {body && <div className={classes.body}>{body}</div>}
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {link.text}
          </a>
        )}
        {cta.length > 0 && <div className={classes.cta}>{cta}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
