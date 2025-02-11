/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusFilter } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import type { EmployeeGroup } from "../../types";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";

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

  const STATUS_OPTIONS = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Inactive",
      value: "inactive",
    },
  ];

  const handleImportEmployeeGroups = () => {
    setSidePanelContent(
      "Choose an identity provider",
      <Suspense fallback={<LoadingState />}>
        <EmployeeGroupIdentityProviderForm />
      </Suspense>,
    );
  };

  const handleEditPriority = () => {
    //
  };

  const handleRemove = () => {
    //
  };

  const handleAssignAutoinstallFile = () => {
    //
  };

  return (
    <>
      <HeaderWithSearch
        onSearch={() => {
          // handleSearch
        }}
        actions={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <StatusFilter options={STATUS_OPTIONS} />
              <StatusFilter options={STATUS_OPTIONS} />
              <StatusFilter options={STATUS_OPTIONS} />
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
                    className="p-segmented-control__button"
                    hasIcon
                    onClick={handleImportEmployeeGroups}
                  >
                    <Icon name={ICONS.plus} />
                    <span>Import employee groups</span>
                  </Button>
                  <Button className="p-segmented-control__button" hasIcon>
                    <Icon name="sort-both" />
                    <span>Edit priority</span>
                  </Button>
                </div>
              </div>
              <div className="p-segmented-control">
                <div className="p-segmented-control__list">
                  <Button
                    className="p-segmented-control__button"
                    hasIcon
                    disabled={selectedEmployeeGroups.length === 0}
                  >
                    <Icon name={ICONS.delete} />
                    <span>Remove</span>
                  </Button>
                  <Button
                    className="p-segmented-control__button"
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
    </>
  );
};

export default EmployeeGroupsHeader;
