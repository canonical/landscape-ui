import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { pluralize } from "@/utils/_helpers";
import SidePanel from "@/components/layout/SidePanel";
import type { PackageChangePlanActionType } from "../../../../types";
import PackagesActionExclusionsDetails from "../PackagesActionExclusionsDetails";

export interface PackagesActionExclusionsCount {
  readonly count: number;
  readonly id: number;
  readonly actionType: PackageChangePlanActionType;
  readonly packageName: string;
}

const PackageActionExclusionsCount: FC<PackagesActionExclusionsCount> = ({
  count,
  id,
  actionType,
  packageName,
}) => {
  const {
    value: isSidePanelOpen,
    setTrue: openSidePanel,
    setFalse: closeSidePanel,
  } = useBoolean();

  const getHeader = () => {
    switch (actionType) {
      case "install":
        return `Instances not installing ${packageName}`;
      case "remove":
        return `Instances not uninstalling ${packageName}`;
      case "hold":
        return `Instances not holding ${packageName}`;
      case "unhold":
        return `Instances not unholding ${packageName}`;
      case "change_version":
        return `Instances not changing ${packageName} to a different version`;
      case "upgrade":
        return `Instances not upgrading ${packageName}`;
    }
  };

  return (
    <>
      <Button
        type="button"
        appearance="link"
        onClick={openSidePanel}
        className="u-no-margin u-no-padding"
      >
        {pluralize(count, ["instance"], "exact")}
      </Button>
      <SidePanel onClose={closeSidePanel} isOpen={isSidePanelOpen}>
        <SidePanel.Header>{getHeader()}</SidePanel.Header>
        <SidePanel.Content>
          <PackagesActionExclusionsDetails id={id} packageName={packageName} />
        </SidePanel.Content>
      </SidePanel>
    </>
  );
};

export default PackageActionExclusionsCount;
