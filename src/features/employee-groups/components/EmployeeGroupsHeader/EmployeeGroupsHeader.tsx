/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import {
  Button,
  ConfirmationButton,
  Icon,
  ICONS,
} from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import type { EmployeeGroup } from "../../types";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import useNotify from "@/hooks/useNotify";
import { getRemoveEmployeeGroupsModalTexts } from "./helpers";
import EmployeeGroupsFilter from "../EmployeeGroupsFilter";
import type { SelectOption } from "@/types/SelectOption";
import { getEmployeeGroupOptions, isNotUnique } from "../../helpers";

const EmployeeGroupIdentityProviderForm = lazy(
  () => import("../EmployeeGroupIdentityProviderForm"),
);

interface EmployeeGroupsHeaderProps {
  readonly employeeGroups: EmployeeGroup[];
  readonly selectedEmployeeGroups: number[];
}

const EmployeeGroupsHeader: FC<EmployeeGroupsHeaderProps> = ({
  employeeGroups,
  selectedEmployeeGroups,
}) => {
  const { setSidePanelContent } = useSidePanel();
  const { notify } = useNotify();

  const handleImportEmployeeGroups = () => {
    setSidePanelContent(
      "Choose an identity provider",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupIdentityProviderForm />
      </Suspense>,
    );
  };

  const { title, body, notificationText, notificationTitle } =
    getRemoveEmployeeGroupsModalTexts(
      employeeGroups.filter((employeeGroup) =>
        selectedEmployeeGroups.includes(employeeGroup.id),
      ),
    );

  const handleEditPriority = () => {
    //
  };

  const handleRemove = () => {
    //TODO: implement
    notify.success({
      title: notificationTitle,
      message: notificationText,
    });
  };

  const handleAssignAutoinstallFile = () => {
    //
  };

  const employeeGroupOptions = getEmployeeGroupOptions(employeeGroups, false);

  return (
    <>
      <HeaderWithSearch
        actions={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <EmployeeGroupsFilter employeeGroupsData={employeeGroups} />
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              <div className="p-segmented-control">
                <div className="p-segmented-control__list">
                  <Button
                    className="p-segmented-control__button u-no-margin--bottom"
                    hasIcon
                    onClick={handleImportEmployeeGroups}
                  >
                    <Icon name={ICONS.plus} />
                    <span>Import employee groups</span>
                  </Button>
                  <Button
                    className="p-segmented-control__button u-no-margin--bottom"
                    hasIcon
                  >
                    <Icon name="sort-both" />
                    <span>Edit priority</span>
                  </Button>
                </div>
              </div>
              <div className="p-segmented-control">
                <div className="p-segmented-control__list">
                  <ConfirmationButton
                    className="p-segmented-control__button has-icon u-no-margin--bottom"
                    disabled={selectedEmployeeGroups.length === 0}
                    confirmationModalProps={{
                      title: title,
                      children: body,
                      confirmButtonLabel: "Remove",
                      confirmButtonAppearance: "negative",
                      onConfirm: handleRemove,
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
        filtersToDisplay={["employeeGroups"]}
        employeeGroupOptions={employeeGroupOptions}
      />
    </>
  );
};

export default EmployeeGroupsHeader;
