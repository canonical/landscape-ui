import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { Fragment, lazy, Suspense } from "react";
import { INSTALLED_PACKAGE_ACTIONS } from "../../constants";
import type { InstalledPackageAction, InstancePackage } from "../../types";
import { highlightVersionsDifference } from "./helpers";

const InstalledPackagesActionForm = lazy(
  () => import("../InstalledPackagesActionForm"),
);

interface PackageDetailsProps {
  readonly singlePackage: InstancePackage;
}

const PackageDetails: FC<PackageDetailsProps> = ({ singlePackage }) => {
  const { setSidePanelContent } = useSidePanel();

  const handleExistingPackages = (action: InstalledPackageAction) => {
    setSidePanelContent(
      `${INSTALLED_PACKAGE_ACTIONS[action].label} ${singlePackage.name}`,
      <Suspense fallback={<LoadingState />}>
        <InstalledPackagesActionForm
          action={action}
          packages={[singlePackage]}
        />
      </Suspense>,
    );
  };

  const buttonRenderCondition: Record<InstalledPackageAction, boolean> = {
    remove: true,
    hold: singlePackage.status !== "held",
    unhold: singlePackage.status === "held",
    upgrade:
      !!singlePackage.available_version &&
      singlePackage.available_version !== singlePackage.current_version,
    downgrade: singlePackage.status !== "held",
  };

  return (
    <>
      <div key="buttons" className="p-segmented-control">
        {Object.keys(INSTALLED_PACKAGE_ACTIONS)
          .map((key) => key as InstalledPackageAction)
          .sort(
            (a, b) =>
              INSTALLED_PACKAGE_ACTIONS[b].order -
              INSTALLED_PACKAGE_ACTIONS[a].order,
          )
          .map((packageAction) => (
            <Fragment key={packageAction}>
              {buttonRenderCondition[packageAction] && (
                <Button
                  type="button"
                  className="p-segmented-control__button has-icon"
                  onClick={() => {
                    handleExistingPackages(packageAction);
                  }}
                >
                  <Icon name={INSTALLED_PACKAGE_ACTIONS[packageAction].icon} />
                  <span>{INSTALLED_PACKAGE_ACTIONS[packageAction].label}</span>
                </Button>
              )}
            </Fragment>
          ))}
      </div>

      <InfoGrid>
        <InfoGrid.Item label="Name" size={12} value={singlePackage.name} />

        <InfoGrid.Item
          label="Summary"
          size={12}
          value={singlePackage.summary}
        />

        <InfoGrid.Item
          label="Current version"
          size={6}
          value={singlePackage.current_version}
        />

        {singlePackage.available_version !== null &&
          singlePackage.available_version !== singlePackage.current_version && (
            <InfoGrid.Item
              label="Upgradable to"
              size={6}
              value={highlightVersionsDifference(singlePackage)}
            />
          )}
      </InfoGrid>
    </>
  );
};

export default PackageDetails;
