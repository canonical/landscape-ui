import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { MASKED_VALUE } from "@/constants";
import { ACTIVITY_STATUSES } from "@/features/activities";
import { Icon, Tooltip } from "@canonical/react-components";
import type { FC } from "react";
import useGetRecoveryKey from "../../api/useGetRecoveryKey";
import {
  getRecoveryKeyRegenerationAttemptMessage,
  shouldShowRecoveryKeyActivityStatus,
} from "../../helpers";
import classes from "./RecoveryKeyStatus.module.scss";

interface RecoveryKeyStatusProps {
  readonly instanceId: number;
  readonly showWarningTooltip?: boolean;
}

const RecoveryKeyStatus: FC<RecoveryKeyStatusProps> = ({
  instanceId,
  showWarningTooltip = true,
}) => {
  const { recoveryKey, recoveryKeyActivityStatus, isGettingRecoveryKey } =
    useGetRecoveryKey(instanceId);

  const shouldShowRecoveryKeyActivity = shouldShowRecoveryKeyActivityStatus(
    recoveryKeyActivityStatus,
  );
  const recoveryKeyRegenerationAttemptMessage =
    getRecoveryKeyRegenerationAttemptMessage(
      recoveryKey,
      recoveryKeyActivityStatus,
    );

  if (isGettingRecoveryKey) {
    return <LoadingState inline />;
  }

  if (shouldShowRecoveryKeyActivity && recoveryKeyActivityStatus) {
    return (
      <>
        Activity:{" "}
        <code>{`${ACTIVITY_STATUSES[recoveryKeyActivityStatus].label}`}</code>
      </>
    );
  }

  if (showWarningTooltip && recoveryKeyRegenerationAttemptMessage) {
    return (
      <>
        <span>{MASKED_VALUE}</span>
        <Tooltip
          position="top-center"
          message={recoveryKeyRegenerationAttemptMessage}
          className={classes.tooltip}
        >
          <Icon name="warning" aria-label="Recovery key warning" />
        </Tooltip>
      </>
    );
  }

  if (recoveryKey) {
    return <>{MASKED_VALUE}</>;
  }

  return <NoData />;
};

export default RecoveryKeyStatus;
