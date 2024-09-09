import classNames from "classnames";
import { FC, lazy, Suspense } from "react";
import { Button, Icon } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { INSTALLED_PACKAGE_ACTIONS } from "../../constants";
import { InstalledPackageAction, InstancePackage } from "../../types";
import classes from "./PackageActions.module.scss";

const InstalledPackagesActionForm = lazy(
  () => import("../InstalledPackagesActionForm"),
);
const PackagesInstallForm = lazy(() => import("../PackagesInstallForm"));

interface PackageActionsProps {
  selectedPackages: InstancePackage[];
}

const PackageActions: FC<PackageActionsProps> = ({ selectedPackages }) => {
  const { setSidePanelContent } = useSidePanel();

  const handleExistingPackages = (
    action: Exclude<InstalledPackageAction, "downgrade">,
  ) => {
    const titleEnding =
      selectedPackages.length === 1
        ? selectedPackages[0].name
        : `${selectedPackages.length} selected packages`;

    setSidePanelContent(
      `${INSTALLED_PACKAGE_ACTIONS[action].label} ${titleEnding}`,
      <Suspense fallback={<LoadingState />}>
        <InstalledPackagesActionForm
          action={action}
          packages={selectedPackages}
        />
      </Suspense>,
    );
  };

  const actionDisabledCondition: Record<
    Exclude<InstalledPackageAction, "downgrade">,
    boolean
  > = {
    remove:
      0 === selectedPackages.length ||
      selectedPackages.every((pkg) => !pkg.current_version),
    hold:
      0 === selectedPackages.length ||
      selectedPackages.every((pkg) => pkg.status === "held"),
    unhold:
      0 === selectedPackages.length ||
      selectedPackages.every((pkg) => pkg.status !== "held"),
    upgrade:
      0 === selectedPackages.length ||
      selectedPackages.every((pkg) => !pkg.available_version),
  };

  const handlePackagesInstall = () => {
    setSidePanelContent(
      "Install packages",
      <Suspense fallback={<LoadingState />}>
        <PackagesInstallForm />
      </Suspense>,
    );
  };

  return (
    <div className={classes.container}>
      <Button
        type="button"
        onClick={handlePackagesInstall}
        hasIcon
        className={classes.noWrap}
      >
        <i className="p-icon--plus" />
        <span>Install</span>
      </Button>
      <div
        key="buttons"
        className={classNames("p-segmented-control is-small", classes.noWrap)}
      >
        {Object.keys(INSTALLED_PACKAGE_ACTIONS)
          .filter((packageAction) => packageAction !== "downgrade")
          .map((key) => key as Exclude<InstalledPackageAction, "downgrade">)
          .sort(
            (a, b) =>
              INSTALLED_PACKAGE_ACTIONS[a].order -
              INSTALLED_PACKAGE_ACTIONS[b].order,
          )
          .map((packageAction) => (
            <Button
              key={packageAction}
              type="button"
              className="p-segmented-control__button has-icon"
              disabled={actionDisabledCondition[packageAction]}
              onClick={() => handleExistingPackages(packageAction)}
            >
              <Icon name={INSTALLED_PACKAGE_ACTIONS[packageAction].icon} />
              <span>{INSTALLED_PACKAGE_ACTIONS[packageAction].label}</span>
            </Button>
          ))}
      </div>
    </div>
  );
};

export default PackageActions;
