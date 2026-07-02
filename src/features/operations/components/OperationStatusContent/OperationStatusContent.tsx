import type { OperationMetadata } from "@/features/operations";
import type { FC } from "react";
import classes from "./OperationStatusContent.module.scss";
import ViewLogsButton from "../ViewLogsButton";
import { getOperationTypeTexts } from "./helpers";
import { Icon, ICONS } from "@canonical/react-components";
import ProgressBar from "@/components/ui/ProgressBar";

interface OperationStatusContentProps {
  readonly type: "publication" | "mirror" | "local";
  readonly operationMetadata: OperationMetadata | undefined;
  readonly hasOperation: boolean;
  readonly isTableCell?: boolean;
}

const OperationStatusContent: FC<OperationStatusContentProps> = ({
  operationMetadata,
  type,
  hasOperation,
  isTableCell = false,
}) => {
  const { inexistent, successful, failed, ongoing } = getOperationTypeTexts(
    type,
    isTableCell,
  );
  const { status, resource, progressPercent = 0 } = operationMetadata ?? {};
  const resourceId = type === "mirror" ? resource : resource?.split("/").pop();

  const getContent = () => {
    if (!hasOperation) {
      return <span>{inexistent}</span>;
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
          <ViewLogsButton resource={resourceId} />
        </>
      );
    }

    return (
      <>
        <Icon
          name={`${ICONS.spinner} u-animation--spin ${classes.marginRight}`}
        />
        <div className={classes.progressContainer}>
          <span className={classes.marginRight} id={`${resource}-progress`}>
            {ongoing}
          </span>
          {isTableCell ? (
            <span className="u-text--muted" aria-live="off">
              {progressPercent}%
            </span>
          ) : (
            <ProgressBar
              progressPercent={progressPercent}
              labelledBy={`${resource}-progress`}
            />
          )}
        </div>
      </>
    );
  };

  return <span aria-live="polite">{getContent()}</span>;
};

export default OperationStatusContent;
