import type { Operation } from "@/features/operations";
import type { FC } from "react";
import classes from "./OperationStatusCell.module.scss";
import ViewLogsButton from "../ViewLogsButton";
import LoadingState from "@/components/layout/LoadingState";
import { getOperationTypeTexts } from "./helpers";

interface OperationStatusCellProps {
  readonly operation: Operation | undefined;
  readonly isGettingOperation?: boolean;
  readonly type: "publication" | "mirror" | "local";
}

const OperationStatusCell: FC<OperationStatusCellProps> = ({
  operation,
  isGettingOperation = false,
  type,
}) => {
  if (isGettingOperation) {
    return <LoadingState inline />;
  }

  const { inexistent, successful, failed, ongoing } =
    getOperationTypeTexts(type);
  const { status, resource, progressPercent = 0 } = operation?.metadata ?? {};
  const resourceIdentifier =
    type === "mirror" ? resource : resource?.split("/").pop();

  if (!status) {
    return inexistent;
  }

  if (status === "succeeded") {
    return successful;
  }

  if (status === "failed") {
    return (
      <>
        <span className={classes.failedText}>{failed}</span>
        <ViewLogsButton resource={resourceIdentifier} />
      </>
    );
  }

  return (
    <>
      {ongoing}
      <div className={classes.progressBar}>
        <div style={{ width: `${progressPercent}%` }} />
      </div>
      <span className="u-text--muted">{progressPercent}%</span>
    </>
  );
};

export default OperationStatusCell;
