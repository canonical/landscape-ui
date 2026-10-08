import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";
import ViewLogsButton from "../ViewLogsButton";
import type { Operation } from "../../types";
import ProgressBar from "@/components/ui/ProgressBar";
import { useCancelOperation } from "../../api";
import { useCanCancelOperations } from "../../hooks";
import classes from "./OperationStatusNotification.module.scss";
import useDebug from "@/hooks/useDebug";

interface OperationStatusNotificationProps {
  readonly operation?: Operation;
  readonly type: "import" | "update" | "publishing";
}

const OperationStatusNotification: FC<OperationStatusNotificationProps> = ({
  operation,
  type,
}) => {
  const { cancelOperation, isCancelingOperation } = useCancelOperation();
  const canCancelOperations = useCanCancelOperations();
  const debug = useDebug();

  if (!operation) {
    return null;
  }

  const getContents = () => {
    switch (type) {
      case "update":
        return {
          errorTitle: "Update failed:",
          errorMessage:
            "Your last mirror update was not completed successfully.",
          progressText: "This mirror is currently being updated",
        };
      case "publishing":
        return {
          errorTitle: "Publishing failed:",
          errorMessage: "Your last publication was not completed successfully.",
          progressText: "This publication is currently being published",
        };
      case "import":
        return {
          errorTitle: "Package import failed:",
          errorMessage:
            "Your last package import was not completed successfully.",
          progressText: "This local repository is currently importing packages",
        };
    }
  };

  const content = getContents();
  const { name, done, metadata } = operation;

  const handleCancel = async () => {
    try {
      await cancelOperation(name);
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div aria-live="polite">
      {!done && (
        <div className={classes.inProgress}>
          <strong>{content.progressText}</strong>
          <div aria-live="off">
            <ProgressBar progress={metadata.progressPercent} fullWidth />
          </div>
          {canCancelOperations && (
            <Button
              appearance="link"
              onClick={handleCancel}
              className={classes.cancelButton}
              disabled={isCancelingOperation}
            >
              {isCancelingOperation ? "Canceling..." : `Cancel ${type}`}
            </Button>
          )}
        </div>
      )}
      {metadata.status === "failed" && (
        <Notification severity="negative" title={content.errorTitle} inline>
          <span>{content.errorMessage} </span>
          <ViewLogsButton key="view-logs" />
        </Notification>
      )}
    </div>
  );
};

export default OperationStatusNotification;
