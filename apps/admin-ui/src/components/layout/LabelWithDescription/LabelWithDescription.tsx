import classNames from "classnames";
import type { FC, ReactNode } from "react";
import classes from "./LabelWithDescription.module.scss";

interface LabelWithDescriptionProps {
  readonly className?: string;
  readonly description?: ReactNode;
  readonly label?: ReactNode;
  readonly link?: string;
}

const LabelWithDescription: FC<LabelWithDescriptionProps> = ({
  className,
  description,
  label,
  link,
}) => {
  return (
    <>
      <p className={classNames("u-no-margin--bottom", className)}>{label}</p>

      <small className={classes.description}>
        {description}

        {link && (
          <a
            className={classes.link}
            href={link}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            learn more
          </a>
        )}
      </small>
    </>
  );
};

export default LabelWithDescription;
