import type { OperationMetadata } from "../../types";
import type { FC } from "react";
import { useCancelOperation } from "../../api";
import classes from "./OperationStatusContent.module.scss";
import ViewLogsButton from "../ViewLogsButton";
import { getOperationTypeTexts } from "./helpers";
import { Button, Icon, ICONS } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import { useCanCancelOperations } from "../../hooks";

interface OperationStatusContentProps {
  readonly type: "publication" | "mirror" | "local";
  readonly operationMetadata: OperationMetadata | undefined;
  readonly hasOperation: boolean;
  readonly isTableCell?: boolean;
  readonly isGettingOperations?: boolean;
}

const OperationStatusContent: FC<OperationStatusContentProps> = ({
  operationMetadata,
  type,
  hasOperation,
  isTableCell = false,
  isGettingOperations = false,
}) => {
  const debug = useDebug();

  const { inexistent, successful, failed, ongoing } =
    getOperationTypeTexts(type);
  const {
    status,
    resource,
    progressPercent = 0,
    operationId = "",
  } = operationMetadata ?? {};
  const resourceId = type === "mirror" ? resource : resource?.split("/").pop();

  const { cancelOperation, isCancelingOperation } = useCancelOperation();
  const canCancelOperations = useCanCancelOperations();

  const handleCancel = async () => {
    try {
      await cancelOperation(`operations/${operationId}`);
    } catch (error) {
      debug(error);
    }
  };

  const getContent = () => {
    if (!hasOperation) {
      return (
        <>
          <Icon name={`${ICONS.information} ${classes.marginRight}`} />
          <span>{inexistent}</span>
        </>
      );
    }

    if (isGettingOperations) {
      return (
        <>
          <Icon
            name={`spinner--muted u-animation--spin ${classes.marginRight}`}
          />
          <span role="status" className="u-text--muted">
            Loading...
          </span>
        </>
      );
    }

    if (!status) {
      return (
        <>
          <Icon name={`${ICONS.warning} ${classes.marginRight}`} />
          <span>Unable to determine</span>
        </>
      );
    }

    if (status === "succeeded") {
      return (
        <>
          <Icon name={`success-grey ${classes.marginRight}`} />
          <span>{successful}</span>
        </>
      );
    }

    if (status === "failed") {
      return (
        <>
          <Icon name={`${ICONS.error} ${classes.marginRight}`} />
          <span className={classes.marginRight}>{failed}</span>
          <ViewLogsButton resource={isTableCell ? resourceId : undefined} />
        </>
      );
    }

    return (
      <>
        <Icon name={`status-in-progress ${classes.marginRight}`} />
        <span className={classes.marginRight}>{ongoing}</span>
        <span className="u-text--muted" aria-live="off">
          {progressPercent}%
        </span>
        {isTableCell && canCancelOperations && (
          <Button
            appearance="link"
            onClick={handleCancel}
            className={classes.marginLeft}
            disabled={isCancelingOperation}
          >
            {isCancelingOperation ? "Canceling..." : "Cancel"}
          </Button>
        )}
      </>
    );
  };

  return <div aria-live="polite">{getContent()}</div>;
};

export default OperationStatusContent;
