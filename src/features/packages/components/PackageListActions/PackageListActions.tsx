import { FC, Fragment, lazy, Suspense } from "react";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import { INSTALLED_PACKAGE_ACTIONS } from "../../constants";
import { InstalledPackageAction, InstancePackage } from "../../types";
import classes from "./PackageListActions.module.scss";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";

const InstalledPackagesActionForm = lazy(
  () => import("../InstalledPackagesActionForm"),
);

interface PackageListActionsProps {
  pkg: InstancePackage;
}

const PackageListActions: FC<PackageListActionsProps> = ({ pkg }) => {
  const { setSidePanelContent } = useSidePanel();

  const buttonRenderCondition: Record<InstalledPackageAction, boolean> = {
    remove: true,
    hold: pkg.status !== "held",
    unhold: pkg.status === "held",
    upgrade:
      !!pkg.available_version && pkg.available_version !== pkg.current_version,
    downgrade: pkg.status !== "held",
  };

  const handlePackageAction = (action: InstalledPackageAction) => {
    setSidePanelContent(
      `${INSTALLED_PACKAGE_ACTIONS[action].label} ${pkg.name}`,
      <Suspense fallback={<LoadingState />}>
        <InstalledPackagesActionForm action={action} packages={[pkg]} />
      </Suspense>,
    );
  };

  return (
    <ContextualMenu
      position="left"
      toggleClassName={classes.toggleButton}
      toggleAppearance="base"
      toggleLabel={<Icon name="contextual-menu" />}
      toggleProps={{ "aria-label": `${pkg.name} package actions` }}
    >
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
                appearance="base"
                hasIcon
                className="p-contextual-menu__link"
                onClick={() => handlePackageAction(packageAction)}
                aria-label={`${INSTALLED_PACKAGE_ACTIONS[packageAction].label} ${pkg.name} package`}
              >
                <Icon name={INSTALLED_PACKAGE_ACTIONS[packageAction].icon} />
                <span>{INSTALLED_PACKAGE_ACTIONS[packageAction].label}</span>
              </Button>
            )}
          </Fragment>
        ))}
    </ContextualMenu>
  );
};

export default PackageListActions;
