import { ROOT_PATH } from "@/constants";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  ICONS,
  Input,
  PasswordToggle,
} from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import classes from "./EmployeeDetailsContextualMenu.module.scss";
import useNotify from "@/hooks/useNotify";
import { useActivities } from "@/features/activities";
import { activities } from "@/tests/mocks/activity";
import type { Instance } from "@/types/Instance";
import { useEmployees } from "../../api";
import LoadingState from "@/components/layout/LoadingState";

interface EmployeeDetailsContextualMenuProps {
  readonly instance: Instance; //TODO change to truncated type
}

const EmployeeDetailsContextualMenu: FC<EmployeeDetailsContextualMenuProps> = ({
  instance,
}) => {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [confirmationText, setConfirmationText] = useState("");

  const { notify } = useNotify();
  const navigate = useNavigate();
  const { getRecoveryKey } = useEmployees();
  const { openActivityDetails } = useActivities();

  const { data: recoveryKeyQueryResult, isLoading: isLoadingRecoveryKey } =
    getRecoveryKey(
      {},
      {
        enabled: selectedAction === "recoveryKey",
      },
    );

  const recoveryKey = recoveryKeyQueryResult?.data.fde_recovery_key || "";

  const handleCloseModal = () => {
    setSelectedAction("");
    setConfirmationText("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationText(e.target.value);
  };

  const contextualMenuLinks: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="machines" />
          <span>View details</span>
        </>
      ),
      "aria-label": `View ${instance.name} instance details`,
      hasIcon: true,
      onClick: () => navigate(`${ROOT_PATH}instances/${instance.id}`),
    },
    {
      children: (
        <>
          <Icon name="private-key" />
          <span>View recovery key</span>
        </>
      ),
      "aria-label": `View ${instance.name} recovery key`,
      hasIcon: true,
      onClick: () => setSelectedAction("recoveryKey"),
    },
    {
      children: (
        <>
          <Icon name="tidy" />
          <span>Sanitize</span>
        </>
      ),
      "aria-label": `Sanitize ${instance.name} instance`,
      hasIcon: true,
      onClick: () => setSelectedAction("sanitize"),
    },
    {
      children: (
        <>
          <Icon name={ICONS.delete} />
          <span>Remove from Landscape</span>
        </>
      ),
      "aria-label": `Remove from Landscape`,
      hasIcon: true,
      onClick: () => setSelectedAction("remove"),
    },
  ];

  return (
    <>
      <ContextualMenu
        position="left"
        className={classes.menu}
        toggleClassName={classes.toggleButton}
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" aria-hidden />}
        toggleProps={{ "aria-label": `${instance.name} profile actions` }}
        links={contextualMenuLinks}
      />
      {selectedAction === "recoveryKey" && (
        <ConfirmationModal
          title="View recovery key"
          confirmButtonLabel="Done"
          confirmButtonAppearance="positive"
          onConfirm={handleCloseModal}
          close={handleCloseModal}
        >
          <p>
            This key allows you to unlock and access encrypted data on instance
            if the primary encryption passphrase is unavailable or forgotten.
            Share it only through a secure method.
          </p>
          {isLoadingRecoveryKey ? (
            <LoadingState />
          ) : (
            <PasswordToggle
              id="recoveryKey"
              label="Recovery key"
              defaultValue={recoveryKey}
              // defaultValue={instance.recovery_key}
              readOnly
            />
          )}
        </ConfirmationModal>
      )}
      {selectedAction === "remove" && (
        <ConfirmationModal
          title={`Remove ${instance.name} instance`}
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          //   confirmButtonDisabled={
          //     isRemoving || confirmationText !== `remove ${profile.name}`
          //   }
          //   confirmButtonLoading={isRemoving}
          //   onConfirm={handleRemoveWslProfile}
          onConfirm={() => {
            console.log("implement");
          }}
          close={handleCloseModal}
        >
          <p>You are about to remove this instance from the user.</p>
        </ConfirmationModal>
      )}
      {selectedAction === "sanitize" && (
        <ConfirmationModal
          title={`Sanitize "${instance.title}" instance`}
          confirmButtonLabel="Sanitize"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={
            confirmationText !== `sanitize ${instance.title}`
          }
          onConfirm={() => {
            notify.success({
              title: `You have successfully initiated Sanitization for ${instance.title}`,
              message: `Sanitizing for ${instance.title} has been queued in Activities. The data will be permanently irrecoverable once complete.`,
              actions: [
                {
                  label: "View details",
                  onClick: () => openActivityDetails(activities[0]),
                },
              ],
            });
            handleCloseModal();
          }}
          close={handleCloseModal}
        >
          <p>
            Sanitization will permanently delete the encryption keys for{" "}
            {instance.title}, making its data completely irrecoverable. This
            action cannot be undone. Please confirm your wish to proceed.
          </p>
          <p>
            Type <b>sanitize {instance.title}</b> to confirm.
          </p>
          <Input type="text" value={confirmationText} onChange={handleChange} />
        </ConfirmationModal>
      )}
    </>
  );
};

export default EmployeeDetailsContextualMenu;
