import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import PackagesActionSummaryDetails from "../PackagesActionSummaryDetails";
import { pluralize } from "@/utils/_helpers";
import type {
  PackageAction,
  PackageChangePlanSummaryItem,
} from "@/features/packages";
import SidePanel from "@/components/layout/SidePanel";

export interface PackagesActionSummaryCountProps {
  readonly count: number;
  readonly action: PackageAction;
  readonly packageChangePlanId: number;
  readonly packageChangePlanSummaryItem: PackageChangePlanSummaryItem;
}

const PackagesActionSummaryCount: FC<PackagesActionSummaryCountProps> = ({
  count,
  action,
  packageChangePlanId,
  packageChangePlanSummaryItem,
}) => {
  const {
    value: isSidePanelOpen,
    setTrue: openSidePanel,
    setFalse: closeSidePanel,
  } = useBoolean();

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
        <SidePanel.Header>
          Instances {action}ing {packageChangePlanSummaryItem.package_name}{" "}
          {packageChangePlanSummaryItem.package_version}
        </SidePanel.Header>
        <SidePanel.Content>
          <PackagesActionSummaryDetails
            packageChangePlanId={packageChangePlanId}
            packageChangePlanSummaryItem={packageChangePlanSummaryItem}
          />
        </SidePanel.Content>
      </SidePanel>
    </>
  );
};

export default PackagesActionSummaryCount;
