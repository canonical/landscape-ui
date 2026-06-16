import type { Operation } from "@/features/operations";
import type { FC } from "react";
import classes from "./OperationStatusCell.module.scss";
import ViewLogsButton from "../ViewLogsButton";
import LoadingState from "@/components/layout/LoadingState";

interface OperationStatusCellProps {
  readonly operation: Operation | undefined;
  readonly isGettingOperation?: boolean;
}

const OperationStatusCell: FC<OperationStatusCellProps> = ({
  operation,
  isGettingOperation = false,
}) => {
  if (isGettingOperation) {
    return <LoadingState inline />;
  }

  const { status, resource, progressPercent = 0 } = operation?.metadata ?? {};

  if (!status) {
    return "Not yet updated";
  }

  if (status === "succeeded") {
    return "Updated";
  }

  if (status === "failed") {
    return (
      <>
        <span className={classes.failedText}>Update failed</span>
        <ViewLogsButton resource={resource} />
      </>
    );
  }

  return (
    <>
      Updating
      <div className={classes.progressBar}>
        <div style={{ width: `${progressPercent}%` }} />
      </div>
      <span className="u-text--muted">{progressPercent}%</span>
    </>
  );
};

export default OperationStatusCell;
