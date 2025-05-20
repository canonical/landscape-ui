import { AutoinstallFilesFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import {
  getAutoinstallFileOptions,
  useGetAutoinstallFiles,
} from "@/features/autoinstall-files";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
} from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import { useRemoveEmployeeGroupsModal } from "../../hooks";
import type { EmployeeGroup } from "../../types";
import classes from "./EmployeeGroupsHeader.module.scss";

const EmployeeGroupIdentityIssuerListContainer = lazy(
  async () => import("../EmployeeGroupIdentityIssuerListContainer"),
);

const EmployeeGroupsOrganiserForm = lazy(
  async () => import("../EmployeeGroupsOrganiserForm"),
);

const AssignAutoInstallFileForm = lazy(
  async () => import("../AssignAutoInstallFileForm"),
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
  const { autoinstallFiles } = useGetAutoinstallFiles();

  const selectedGroups = employeeGroups.filter((employeeGroup) =>
    selectedEmployeeGroups.includes(employeeGroup.id),
  );

  const autoinstallFileOptions = useMemo(
    () => getAutoinstallFileOptions(autoinstallFiles),
    [autoinstallFiles],
  );

  const handleEditPriority = () => {
    setSidePanelContent(
      "Organize employee groups priority",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupsOrganiserForm groups={selectedGroups} />
      </Suspense>,
    );
  };

  const handleImportEmployeeGroups = () => {
    setSidePanelContent(
      "Choose an identity issuer",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupIdentityIssuerListContainer />
      </Suspense>,
    );
  };

  const handleAssignAutoinstallFile = () => {
    const formTitle =
      selectedGroups.length === 1
        ? `Reassign autoinstall file to ${selectedGroups[0].name}`
        : `Reassign autoinstall files to ${selectedGroups.length} employee groups`;

    setSidePanelContent(
      formTitle,
      <Suspense fallback={<LoadingState />}>
        <AssignAutoInstallFileForm
          employeeGroups={selectedGroups}
          clearSelectedGroups={() => {
            setSelectedEmployeeGroups([]);
          }}
        />
      </Suspense>,
    );
  };

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

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.container}>
            <AutoinstallFilesFilter options={autoinstallFileOptions} />
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
                    onClick={handleAssignAutoinstallFile}
                  >
                    <Icon name="file" />
                    <span>Reassign autoinstall file</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={["search", "autoinstallFiles"]}
        autoinstallFileOptions={autoinstallFileOptions}
      />
    </>
  );
};

export default EmployeeGroupsHeader;
