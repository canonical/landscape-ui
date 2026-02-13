import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";
import type { Instance } from "@/types/Instance";
import { ConfirmationModal, PasswordToggle } from "@canonical/react-components";
import { type FC, type ReactNode } from "react";
import useGetRecoveryKey from "../../api/useGetRecoveryKey";

interface ViewRecoveryKeyModalProps {
  readonly instance: Instance;
  readonly onClose: () => void;
}

const ViewRecoveryKeyModal: FC<ViewRecoveryKeyModalProps> = ({
  instance,
  onClose,
}) => {
  const { recoveryKey, recoveryKeyActivity, isGettingRecoveryKey } =
    useGetRecoveryKey(instance.id);

  const isRecoveryKeyActivityInProgress = Boolean(
    recoveryKeyActivity &&
    !["succeeded", "failed", "canceled"].includes(
      recoveryKeyActivity.activity_status,
    ),
  );

  const getRecoveryKeyContent = (): ReactNode => {
    if (isGettingRecoveryKey) {
      return <LoadingState />;
    }

    return (
      <>
        {isRecoveryKeyActivityInProgress && recoveryKeyActivity && (
          <p>
            A recovery key generation activity is in progress. You can still
            view the current key until the activity completes.{" "}
            <StaticLink
              target="_blank"
              to={ROUTES.activities.root({
                query: `parent-id:${recoveryKeyActivity.id}`,
              })}
            >
              View activity
            </StaticLink>
          </p>
        )}
        <PasswordToggle
          id={`recovery-key-${instance.id}`}
          label="Recovery key"
          value={recoveryKey ?? ""}
        />
      </>
    );
  };

  return (
    <ConfirmationModal
      close={onClose}
      title={`View recovery key for "${instance.title}"`}
      confirmButtonLabel="Done"
      confirmButtonAppearance="positive"
      onConfirm={onClose}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <p>
        This key allows you to unlock and access encrypted data on instance if
        the primary encryption passphrase is unavailable or forgotten. Share it
        only through a secure method.
      </p>
      {getRecoveryKeyContent()}
    </ConfirmationModal>
  );
};

export default ViewRecoveryKeyModal;
