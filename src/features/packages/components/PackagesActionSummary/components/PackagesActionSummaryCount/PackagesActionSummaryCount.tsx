import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import PackagesActionSummaryDetails from "../PackagesActionSummaryDetails";
import { pluralize } from "@/utils/_helpers";
import SidePanel from "@/components/layout/SidePanel";
import type { PackageChangePlanAction } from "../../../../types";

export interface PackagesActionSummaryCountProps {
  readonly count: number;
  readonly id: number;
  readonly action: PackageChangePlanAction;
}

const PackagesActionSummaryCount: FC<PackagesActionSummaryCountProps> = ({
  count,
  id,
  action,
}) => {
  const {
    value: isSidePanelOpen,
    setTrue: openSidePanel,
    setFalse: closeSidePanel,
  } = useBoolean();

  const getHeader = () => {
    switch (action.type) {
      case "install":
        return `Instances installing ${action.package.name} ${action.package.version}`;
      case "remove":
        return `Instances uninstalling ${action.package.name} ${action.package.version}`;
      case "hold":
        return `Instances holding ${action.package.name} ${action.package.version}`;
      case "unhold":
        return `Instances unholding ${action.package.name} ${action.package.version}`;
      case "change_version":
        return `Instances changing ${action.from_package.name} from ${action.from_package.version} to ${action.to_package.version}`;
      case "upgrade":
        return `Instances upgrading ${action.to_package.name} to ${action.to_package.version}`;
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
          <PackagesActionSummaryDetails id={id} action={action} />
        </SidePanel.Content>
      </SidePanel>
    </>
  );
};

export default PackagesActionSummaryCount;
