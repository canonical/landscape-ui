import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { useId } from "react";
import classes from "./FormSection.module.scss";

export interface FormSectionProps {
  /**
   * Short label for the section, rendered as its heading (e.g. "Theme"). It
   * also names the section for assistive tech via `aria-labelledby`.
   */
  readonly title: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * A labelled settings section: the title sits in its own column beside the
 * content when the section is wide enough and stacks above it otherwise
 * (container-based, so it also adapts when navigation panels shrink the
 * content area). Consecutive sections are separated by a divider. Use it to
 * group controls that are not part of a single submitted form (e.g. a setting
 * applied instantly).
 */
const FormSection: FC<FormSectionProps> = ({ title, children, className }) => {
  const titleId = useId();

  return (
    <section
      className={classNames(classes.section, className)}
      aria-labelledby={titleId}
    >
      <div className={classes.grid}>
        <div>
          <h2
            id={titleId}
            className="p-heading--5 p-text--small-caps u-no-margin--bottom"
          >
            {title}
          </h2>
        </div>
        <div className={classes.content}>{children}</div>
      </div>
    </section>
  );
};

export default FormSection;
