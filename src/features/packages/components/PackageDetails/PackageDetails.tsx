import type { FC } from "react";
import { Fragment, lazy, Suspense } from "react";
import { Button, Col, Icon, Row } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
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
                  onClick={() => handleExistingPackages(packageAction)}
                >
                  <Icon name={INSTALLED_PACKAGE_ACTIONS[packageAction].icon} />
                  <span>{INSTALLED_PACKAGE_ACTIONS[packageAction].label}</span>
                </Button>
              )}
            </Fragment>
          ))}
      </div>

      <div>
        <InfoItem
          type="regular"
          label="Package name"
          value={singlePackage.name}
        />
      </div>
      <div>
        <InfoItem
          type="regular"
          label="Summary"
          value={singlePackage.summary}
        />
      </div>
      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem
            type="regular"
            label="Current version"
            value={singlePackage.current_version}
          />
        </Col>
        {singlePackage.available_version &&
          singlePackage.available_version !== singlePackage.current_version && (
            <Col size={6}>
              <InfoItem
                type="regular"
                label="Upgradable to"
                value={highlightVersionsDifference(singlePackage)}
              />
            </Col>
          )}
      </Row>
    </>
  );
};

export default PackageDetails;
