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
}

const OperationStatusContent: FC<OperationStatusContentProps> = ({
  operationMetadata,
  type,
  hasOperation,
}) => {
  const { inexistent, successful, failed, ongoing } =
    getOperationTypeTexts(type);
  const { status, resource, progressPercent = 0 } = operationMetadata ?? {};
  const resourceIdentifier =
    type === "mirror" ? resource : resource?.split("/").pop();

  if (!hasOperation) {
    return <span>{inexistent}</span>;
  }

  if (!status) {
    return (
      <>
        <Icon name={`${ICONS.warning} ${classes.marginRight}`} />
        <span>Unable to determine status</span>
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
        <ViewLogsButton resource={resourceIdentifier} />
      </>
    );
  }

  return (
    <>
      <Icon name={`${ICONS.spinner} u-animation--spin ${classes.marginRight}`} />
      <span>{ongoing}</span>
      <ProgressBar progressPercent={progressPercent} />
    </>
  );
};

export default OperationStatusContent;
