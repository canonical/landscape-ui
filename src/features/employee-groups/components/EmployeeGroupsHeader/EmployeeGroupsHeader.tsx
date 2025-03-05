/* eslint-disable @typescript-eslint/no-unused-vars */
import { TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
} from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { getEmployeeGroupOptions } from "../../helpers";
import type { EmployeeGroup } from "../../types";
import EmployeeGroupsFilter from "../EmployeeGroupsFilter";
import classes from "./EmployeeGroupsHeader.module.scss";
import { useRemoveEmployeeGroupsModal } from "../../hooks";

const EmployeeGroupIdentityIssuerListContainer = lazy(
  () => import("../EmployeeGroupIdentityIssuerListContainer"),
);

const EmployeeGroupsOrganiserForm = lazy(
  () => import("../EmployeeGroupsOrganiserForm"),
);

interface EmployeeGroupsHeaderProps {
  readonly employeeGroups: EmployeeGroup[];
  readonly selectedEmployeeGroups: number[];
  readonly setSelectedEmployeeGroups: (groupIds: number[]) => void;
}

const EmployeeGroupsHeader: FC<EmployeeGroupsHeaderProps> = ({
  employeeGroups,
  selectedEmployeeGroups,
  setSelectedEmployeeGroups,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const handleImportEmployeeGroups = () => {
    setSidePanelContent(
      "Choose an identity issuer",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupIdentityIssuerListContainer />
      </Suspense>,
    );
  };

  const selectedGroups = employeeGroups.filter((employeeGroup) =>
    selectedEmployeeGroups.includes(employeeGroup.id),
  );

  const handleClearSelection = () => {
    setSelectedEmployeeGroups([]);
  };

  const {
    body,
    confirmButtonLabel,
    confirmButtonAppearance,
    deleteEmployeeGroups,
    isLoading,
    title,
  } = useRemoveEmployeeGroupsModal({
    selectedEmployeeGroups: selectedGroups,
    onSuccess: handleClearSelection,
  });

  const handleEditPriority = () => {
    setSidePanelContent(
      "Organize Employee groups priority",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupsOrganiserForm groups={selectedGroups} />
      </Suspense>,
    );
  };

  const handleAssignAutoinstallFile = () => {
    //
  };

  const employeeGroupOptions = getEmployeeGroupOptions(employeeGroups, false);

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.container}>
            <div>
              <EmployeeGroupsFilter
                employeeGroupsData={employeeGroups}
                searchLabel="Showing employee groups from the current table page. Search to filter from all available groups."
              />
            </div>
            <div className={classes.buttons}>
              <Button
                className="p-segmented-control__button u-no-margin--bottom"
                hasIcon
                onClick={handleImportEmployeeGroups}
              >
                <Icon name={ICONS.plus} />
                <span>Import employee groups</span>
              </Button>
              <div
                className={classNames(
                  "p-segmented-control",
                  classes.segmentedButtons,
                )}
              >
                <div className="p-segmented-control__list">
                  <Button
                    className="p-segmented-control__button u-no-margin--bottom"
                    hasIcon
                    disabled={selectedEmployeeGroups.length === 0}
                    onClick={handleEditPriority}
                  >
                    <Icon name="sort-both" />
                    <span>Edit priority</span>
                  </Button>
                  <ConfirmationButton
                    className="p-segmented-control__button has-icon u-no-margin--bottom"
                    disabled={selectedEmployeeGroups.length === 0}
                    confirmationModalProps={{
                      title: title,
                      children: body,
                      confirmButtonLabel: confirmButtonLabel,
                      confirmButtonAppearance: confirmButtonAppearance,
                      onConfirm: deleteEmployeeGroups,
                      confirmButtonDisabled: isLoading,
                      confirmButtonLoading: isLoading,
                    }}
                  >
                    <Icon name={ICONS.delete} />
                    <span>Remove</span>
                  </ConfirmationButton>
                  <Button
                    className="p-segmented-control__button u-no-margin--bottom"
                    hasIcon
                    disabled={selectedEmployeeGroups.length === 0}
                  >
                    <Icon name="file" />
                    <span>Assign autoinstall file</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={["employeeGroups", "search"]}
        employeeGroupOptions={employeeGroupOptions}
      />
    </>
  );
};

export default EmployeeGroupsHeader;
