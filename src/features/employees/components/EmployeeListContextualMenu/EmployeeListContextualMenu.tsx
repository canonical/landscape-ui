import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useCallback, useState } from "react";
import type { Employee } from "../../types";
import EmployeeActivationStatusModal from "../EmployeeActivationStatusModal";
import classes from "./EmployeeListContextualMenu.module.scss";

const EmployeeDetails = lazy(async () => import("../EmployeeDetails"));

interface EmployeeDetailsContextualMenuProps {
  readonly employee: Employee;
}

const EmployeeListContextualMenu: FC<EmployeeDetailsContextualMenuProps> = ({
  employee,
}) => {
  const [open, setOpen] = useState(false);

  const { setSidePanelContent } = useSidePanel();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

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
          <Icon name={employee.is_active ? "pause" : "play"} />
          <span>{employee.is_active ? "Deactivate" : "Activate"}</span>
        </>
      ),
      "aria-label": `${employee.is_active ? "Deactivate" : "Activate"} ${employee.name}`,
      hasIcon: true,
      onClick: handleOpen,
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
        <EmployeeActivationStatusModal
          employee={employee}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default EmployeeListContextualMenu;
