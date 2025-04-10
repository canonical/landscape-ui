import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  ICONS,
} from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import type { EmployeeGroup } from "../../types";
import classes from "./EmployeeGroupsListContextualMenu.module.scss";
import { useRemoveEmployeeGroupsModal } from "../../hooks";

const AssignAutoInstallFileForm = lazy(
  () => import("../AssignAutoInstallFileForm"),
);

const EditEmployeeGroupPriorityForm = lazy(
  () => import("../EditEmployeeGroupPriorityForm"),
);

interface EmployeeDetailsContextualMenuProps {
  readonly employeeGroup: EmployeeGroup;
}

const EmployeeGroupsListContextualMenu: FC<
  EmployeeDetailsContextualMenuProps
> = ({ employeeGroup }) => {
  const [open, setOpen] = useState(false);

  const { setSidePanelContent } = useSidePanel();

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const {
    body,
    confirmButtonAppearance,
    confirmButtonLabel,
    deleteEmployeeGroups,
    isLoading,
    title,
  } = useRemoveEmployeeGroupsModal({
    selectedEmployeeGroups: [employeeGroup],
    onSuccess: handleCloseModal,
  });

  const handleAssignAutoinstallFile = () => {
    setSidePanelContent(
      `Reassign autoinstall file to ${employeeGroup.name}`,
      <Suspense fallback={<LoadingState />}>
        <AssignAutoInstallFileForm employeeGroups={[employeeGroup]} />
      </Suspense>,
    );
  };

  const handleEditPriority = () => {
    setSidePanelContent(
      `Edit priority for ${employeeGroup.name} group`,
      <Suspense fallback={<LoadingState />}>
        <EditEmployeeGroupPriorityForm group={employeeGroup} />
      </Suspense>,
    );
  };

  const contextualMenuLinks: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="sort-both" />
          <span>Edit priority</span>
        </>
      ),
      "aria-label": `Edit priority for ${employeeGroup.name} employee group`,
      hasIcon: true,
      onClick: handleEditPriority,
    },
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
          <span>Reassign autoinstall file</span>
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
          title={title}
          confirmButtonLabel={confirmButtonLabel}
          confirmButtonAppearance={confirmButtonAppearance}
          confirmButtonDisabled={isLoading}
          confirmButtonLoading={isLoading}
          onConfirm={deleteEmployeeGroups}
          close={handleCloseModal}
        >
          {body}
        </ConfirmationModal>
      )}
    </>
  );
};

export default EmployeeGroupsListContextualMenu;
