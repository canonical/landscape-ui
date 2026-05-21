import InfoGrid from "@/components/layout/InfoGrid";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { Fragment } from "react";
import { INSTALLED_PACKAGE_ACTIONS } from "../../constants";
import type { InstalledPackageAction, InstancePackage } from "../../types";
import { highlightVersionsDifference } from "./helpers";

interface PackageDetailsProps {
  readonly singlePackage: InstancePackage;
}

const PackageDetails: FC<PackageDetailsProps> = ({ singlePackage }) => {
  const { setPageParams, sidePath } = usePageParams();

  const handleExistingPackages = (action: InstalledPackageAction) => {
    setPageParams({
      sidePath: [...sidePath, action],
      name: singlePackage.name,
    });
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
                  className="p-segmented-control__button has-icon u-no-margin"
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

      <InfoGrid spaced>
        <InfoGrid.Item label="Name" large value={singlePackage.name} />

        <InfoGrid.Item label="Summary" large value={singlePackage.summary} />

        <InfoGrid.Item
          label="Current version"
          value={singlePackage.current_version}
        />

        {singlePackage.available_version !== null &&
          singlePackage.available_version !== singlePackage.current_version && (
            <InfoGrid.Item
              label="Upgradable to"
              value={highlightVersionsDifference(singlePackage)}
            />
          )}
      </InfoGrid>
    </>
  );
};

export default PackageDetails;
