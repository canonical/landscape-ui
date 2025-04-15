import { ROOT_PATH } from "@/constants";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import type { Instance } from "@/types/Instance";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Form,
  Icon,
  ICONS,
  Input,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useNavigate } from "react-router";
import classes from "./EmployeeInstancesTableContextualMenu.module.scss";

interface EmployeeInstancesTableContextualMenuProps {
  readonly instance: Instance;
}

const EmployeeInstancesTableContextualMenu: FC<
  EmployeeInstancesTableContextualMenuProps
> = ({ instance }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const { openActivityDetails } = useActivities();
  const { removeInstancesQuery, sanitizeInstanceQuery } = useInstances();

  const { mutateAsync: removeInstances, isPending: isRemoving } =
    removeInstancesQuery;

  const { mutateAsync: sanitizeInstanceMutation, isPending: isSanitizing } =
    sanitizeInstanceQuery;

  const formik = useFormik({
    initialValues: {
      confirmationText: "",
      selectedAction: "",
    },
    onSubmit: async (values) => {
      if (values.selectedAction === "sanitize") {
        try {
          const { data: sanitizeActivity } = await sanitizeInstanceMutation({
            computer_id: instance.id,
            computer_title: instance.title,
          });

          notify.success({
            title: `You have successfully initiated Sanitization for ${instance.title}`,
            message: `Sanitizing for ${instance.title} has been queued in Activities. The data will be permanently irrecoverable once complete.`,
            actions: [
              {
                label: "View details",
                onClick: () => {
                  openActivityDetails(sanitizeActivity);
                },
              },
            ],
          });

          formik.resetForm();
        } catch (error) {
          debug(error);
        }
      } else if (values.selectedAction === "remove") {
        try {
          await removeInstances({
            computer_ids: [instance.id],
          });

          notify.success({
            title: `You have successfully removed ${instance.title}`,
            message: `${instance.title} has been removed from Landscape. To manage it again, you will need to re-register it in Landscape.`,
          });

          formik.resetForm();
        } catch (error) {
          debug(error);
        }
      }
    },
  });

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
      onClick: async () => navigate(`${ROOT_PATH}instances/${instance.id}`),
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
      onClick: async () => formik.setFieldValue("selectedAction", "sanitize"),
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
      onClick: async () => formik.setFieldValue("selectedAction", "remove"),
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
        toggleProps={{ "aria-label": `${instance.title} profile actions` }}
        links={contextualMenuLinks}
      />
      {formik.values.selectedAction === "remove" && (
        <ConfirmationModal
          title={`Remove ${instance.title} instance`}
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={
            isRemoving ||
            formik.values.confirmationText !== `remove ${instance.title}`
          }
          onConfirm={() => {
            formik.handleSubmit();
          }}
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
            isSanitizing ||
            formik.values.confirmationText !== `sanitize ${instance.title}`
          }
          onConfirm={() => {
            formik.handleSubmit();
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

export default EmployeeInstancesTableContextualMenu;
