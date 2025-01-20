import LoadingState from "@/components/layout/LoadingState";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  CheckboxInput,
  ConfirmationModal,
  ContextualMenu,
  Form,
  Icon,
  Input,
  MenuLink,
  Tooltip,
} from "@canonical/react-components";
import { FC, lazy, Suspense, useState } from "react";
import { Employee } from "../../types";
import classes from "./EmployeeListContextualMenu.module.scss";
import {
  REMOVE_FROM_LANDSCAPE_TOOLTIP_MESSAGE,
  SANITIZATION_TOOLTIP_MESSAGE,
} from "../../constants";
import { useFormik } from "formik";

const EmployeeDetails = lazy(() => import("../EmployeeDetails"));

interface EmployeeDetailsContextualMenuProps {
  employee: Employee;
}

const EmployeeListContextualMenu: FC<EmployeeDetailsContextualMenuProps> = ({
  employee,
}) => {
  const [open, setOpen] = useState(false);

  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const { notify } = useNotify();

  const formik = useFormik({
    initialValues: {
      confirmationText: "",
      sanitizeInstances: false,
      removeFromLandscape: false,
    },
    enableReinitialize: true,
    onSubmit: () => {
      formik.resetForm();
      closeSidePanel();
      notify.success({
        title: `You have successfully deactivated ${employee.name}`,
        message:
          "This employee won’t be able to log in to Landscape or register new instances with their account.",
      });
    },
  });

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleViewDetails = () => {
    setSidePanelContent(
      "Employee details",
      <Suspense fallback={<LoadingState />}>
        <EmployeeDetails employee={employee} />
      </Suspense>,
      "medium",
    );
  };

  const contextualMenuLinks: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="file" />
          <span>View details</span>
        </>
      ),
      "aria-label": `View ${employee.name} employee details`,
      hasIcon: true,
      onClick: handleViewDetails,
    },
    {
      children: (
        <>
          <Icon name="pause" />
          <span>Deactivate</span>
        </>
      ),
      "aria-label": `Deactivate employee ${employee.name}`,
      hasIcon: true,
      onClick: handleOpenModal,
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
        toggleProps={{ "aria-label": `${employee.name} actions` }}
        links={contextualMenuLinks}
      />
      {open && (
        <ConfirmationModal
          title={`Remove ${employee.name} group`}
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          //   confirmButtonDisabled={
          //     isRemoving || confirmationText !== `remove ${profile.name}`
          //   }
          //   confirmButtonLoading={isRemoving}
          //   onConfirm={handleRemoveWslProfile}
          onConfirm={() => {
            console.log("implement");
            handleCloseModal();
            notify.success({
              title: `You have successfully removed ${employee.name} group`,
              message: `${employee.name} has been permanently removed from Landscape.`,
            });
          }}
          close={handleCloseModal}
        >
          <>
            <p>
              This will prevent {employee.name} from logging in to Landscape and
              from registering any new instances with their account.
            </p>
            Type <b>deactivate {employee.name}</b> to confirm
            <Form noValidate>
              <Input
                type="text"
                {...formik.getFieldProps("confirmationText")}
              />
              <b>Additional actions</b>
              <div>
                <CheckboxInput
                  label={
                    <span>
                      <span className={classes.title}>
                        Sanitize associated instances
                      </span>
                      <Tooltip
                        position="top-center"
                        message={SANITIZATION_TOOLTIP_MESSAGE}
                        positionElementClassName={
                          classes.tooltipPositionElement
                        }
                      >
                        <Icon name="help" aria-hidden />
                        <span className="u-off-screen">Help</span>
                      </Tooltip>
                    </span>
                  }
                  {...formik.getFieldProps("sanitizeInstances")}
                />
                <CheckboxInput
                  label={
                    <span>
                      <span className={classes.title}>
                        Remove associated instances from Landscape
                      </span>
                      <Tooltip
                        position="top-center"
                        message={REMOVE_FROM_LANDSCAPE_TOOLTIP_MESSAGE}
                        positionElementClassName={
                          classes.tooltipPositionElement
                        }
                      >
                        <Icon name="help" aria-hidden />
                        <span className="u-off-screen">Help</span>
                      </Tooltip>
                    </span>
                  }
                  {...formik.getFieldProps("removeFromLandscape")}
                />
              </div>
            </Form>
          </>
        </ConfirmationModal>
      )}
    </>
  );
};

export default EmployeeListContextualMenu;
