import NoData from "@/components/layout/NoData";
import useGetRecoveryKey from "../../api/useGetRecoveryKey";
import type { FC } from "react";
import { RECOVERY_KEY_MASK } from "./constants";
import LoadingState from "@/components/layout/LoadingState";

interface RecoveryKeyStatusProps {
  readonly instanceId: number;
}

const RecoveryKeyStatus: FC<RecoveryKeyStatusProps> = ({ instanceId }) => {
  const { recoveryKey, isRecoveryKeyActivityInProgress, isGettingRecoveryKey } =
    useGetRecoveryKey(instanceId);

  if (isGettingRecoveryKey) {
    return <LoadingState />;
  }

  if (isRecoveryKeyActivityInProgress) {
    return <>Activity queued</>;
  }

  if (recoveryKey) {
    return <>{RECOVERY_KEY_MASK}</>;
  }

  return <NoData />;
};

export default RecoveryKeyStatus;
