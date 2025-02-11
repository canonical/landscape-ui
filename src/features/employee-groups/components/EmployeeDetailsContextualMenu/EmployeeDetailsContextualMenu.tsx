import { ROOT_PATH } from "@/constants";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Form,
  Icon,
  ICONS,
  Input,
  PasswordToggle,
} from "@canonical/react-components";
import type { FC } from "react";
import { useNavigate } from "react-router";
import classes from "./EmployeeDetailsContextualMenu.module.scss";
import useNotify from "@/hooks/useNotify";
import { useActivities } from "@/features/activities";
import { activities } from "@/tests/mocks/activity";
import type { Instance } from "@/types/Instance";
import useEmployees from "../../hooks";
import LoadingState from "@/components/layout/LoadingState";
import useInstances from "@/hooks/useInstances";
import useDebug from "@/hooks/useDebug";
import { useFormik } from "formik";

interface EmployeeDetailsContextualMenuProps {
  readonly instance: Instance; //TODO change to truncated type
}

const EmployeeDetailsContextualMenu: FC<EmployeeDetailsContextualMenuProps> = ({
  instance,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const { getRecoveryKey } = useEmployees();
  const { openActivityDetails } = useActivities();
  const { removeInstancesQuery } = useInstances();

  const { mutateAsync: removeInstances, isPending: isRemoving } =
    removeInstancesQuery;

  const formik = useFormik({
    initialValues: {
      confirmationText: "",
      selectedAction: "",
    },
    onSubmit: (values) => {
      console.log("values", values); //TODO change
    },
  });

  const { data: recoveryKeyQueryResult, isLoading: isLoadingRecoveryKey } =
    getRecoveryKey(
      {},
      {
        enabled: formik.values.selectedAction === "recoveryKey",
      },
    );

  const handleRemoveInstance = async () => {
    try {
      await removeInstances({
        computer_ids: [instance.id],
      });

      navigate(`${ROOT_PATH}instances`, { replace: true });
    } catch (error) {
      debug(error);
    }
  };

  const handleCloseModal = () => {
    formik.resetForm();
  };

  const contextualMenuLinks: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="machines" />
          <span>View details</span>
        </>
      ),
      "aria-label": `View ${instance.title} instance details`,
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
      "aria-label": `View ${instance.title} recovery key`,
      hasIcon: true,
      onClick: () => formik.setFieldValue("selectedAction", "recoveryKey"),
    },
    {
      children: (
        <>
          <Icon name="tidy" />
          <span>Sanitize</span>
        </>
      ),
      "aria-label": `Sanitize ${instance.title} instance`,
      hasIcon: true,
      onClick: () => formik.setFieldValue("selectedAction", "sanitize"),
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
      onClick: () => formik.setFieldValue("selectedAction", "remove"),
    },
  ];

  const recoveryKey = recoveryKeyQueryResult?.data.fde_recovery_key || "";

  return (
    <>
      <ContextualMenu
        position="left"
        className={classes.menu}
        toggleClassName={classes.toggleButton}
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" aria-hidden />}
        toggleProps={{ "aria-label": `${instance.title} profile actions` }}
        links={contextualMenuLinks}
      />
      {formik.values.selectedAction === "recoveryKey" && (
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
              readOnly
            />
          )}
        </ConfirmationModal>
      )}
      {formik.values.selectedAction === "remove" && (
        <ConfirmationModal
          title={`Remove ${instance.title} instance`}
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={
            isRemoving ||
            formik.values.confirmationText !== `remove ${instance.title}`
          }
          onConfirm={handleRemoveInstance}
          close={handleCloseModal}
        >
          <Form onSubmit={formik.handleSubmit} noValidate>
            <p>
              Removing this {instance.title} will delete all associated data and
              free up one license slot for another computer to be registered.
            </p>
            <p>
              Type <b>remove {instance.title}</b> to confirm.
            </p>
            <Input type="text" {...formik.getFieldProps("confirmationText")} />
          </Form>
        </ConfirmationModal>
      )}
      {formik.values.selectedAction === "sanitize" && (
        <ConfirmationModal
          title={`Sanitize "${instance.title}" instance`}
          confirmButtonLabel="Sanitize"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={
            formik.values.confirmationText !== `sanitize ${instance.title}`
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
          <Form onSubmit={formik.handleSubmit} noValidate>
            <p>
              Sanitization will permanently delete the encryption keys for{" "}
              {instance.title}, making its data completely irrecoverable. This
              action cannot be undone. Please confirm your wish to proceed.
            </p>
            <p>
              Type <b>sanitize {instance.title}</b> to confirm.
            </p>
            <Input type="text" {...formik.getFieldProps("confirmationText")} />
          </Form>
        </ConfirmationModal>
      )}
    </>
  );
};

export default EmployeeDetailsContextualMenu;
