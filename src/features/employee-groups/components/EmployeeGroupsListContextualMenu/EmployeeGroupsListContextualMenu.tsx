import LoadingState from "@/components/layout/LoadingState";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  ICONS,
  MenuLink,
} from "@canonical/react-components";
import { FC, lazy, Suspense, useState } from "react";
import { EmployeeGroup } from "../../types";
import classes from "./EmployeeGroupsListContextualMenu.module.scss";

const AssignAutoInstallFileForm = lazy(
  () => import("../AssignAutoInstallFileForm"),
);

interface EmployeeDetailsContextualMenuProps {
  employeeGroup: EmployeeGroup;
}

const EmployeeGroupsListContextualMenu: FC<
  EmployeeDetailsContextualMenuProps
> = ({ employeeGroup }) => {
  const [open, setOpen] = useState(false);

  const { setSidePanelContent } = useSidePanel();
  const { notify } = useNotify();

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleAssignAutoinstallFile = () => {
    setSidePanelContent(
      "Assign autoinstall file",
      <Suspense fallback={<LoadingState />}>
        <AssignAutoInstallFileForm />
      </Suspense>,
    );
  };

  const contextualMenuLinks: MenuLink[] = [
    {
      children: (
        <>
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </>
      ),
      "aria-label": `Remove ${employeeGroup.name} employee group`,
      hasIcon: true,
      onClick: handleOpenModal,
    },
    {
      children: (
        <>
          <Icon name="file" />
          <span>Assign autoinstall file</span>
        </>
      ),
      "aria-label": `Assign an autoinstall file to ${employeeGroup.name} employee group`,
      hasIcon: true,
      onClick: handleAssignAutoinstallFile,
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
        toggleProps={{ "aria-label": `${employeeGroup.name} actions` }}
        links={contextualMenuLinks}
      />
      {open && (
        <ConfirmationModal
          title={`Remove ${employeeGroup.name} group`}
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
              title: `You have successfully removed ${employeeGroup.name} group`,
              message: `${employeeGroup.name} has been permanently removed from Landscape.`,
            });
          }}
          close={handleCloseModal}
        >
          <p>
            You are about to remove Beta testers employee group from Landscape.
            This action is irreversible and will permanently remove the group
            from the Landscape. However, it will <b>NOT</b> remove the users
            associated with this group.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default EmployeeGroupsListContextualMenu;
