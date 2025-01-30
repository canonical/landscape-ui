import type { FC } from "react";
import classes from "./ReportWidget.module.scss";

interface ReportWidgetProps {
  readonly currentCount: number;
  readonly negativeDescription: string;
  readonly positiveDescription: string;
  readonly title: string;
  readonly totalCount: number;
}

const ReportWidget: FC<ReportWidgetProps> = ({
  currentCount,
  negativeDescription,
  positiveDescription,
  title,
  totalCount,
}) => {
  const percentage = ((100 * currentCount) / totalCount).toFixed();

  return (
    <>
      <div className={classes.header}>
        <span>{title}</span>
        <span>{`${percentage}%`}</span>
      </div>
      <div className={classes.lineContainer}>
        <div className={classes.line} style={{ width: `${percentage}%` }} />
      </div>
      <p className="u-text--muted p-text--small">{positiveDescription}</p>
      <p className="u-text--muted p-text--small u-no-margin--bottom">
        {negativeDescription}
      </p>
    </>
  );
};

export default ReportWidget;
