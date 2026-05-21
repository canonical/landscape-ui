import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { INSTALLED_PACKAGE_ACTIONS } from "../../constants";
import type { InstalledPackageAction, InstancePackage } from "../../types";

interface PackageListActionsProps {
  readonly pkg: InstancePackage;
}

const PackageListActions: FC<PackageListActionsProps> = ({ pkg }) => {
  const { setPageParams, sidePath } = usePageParams();

  const buttonRenderCondition: Record<InstalledPackageAction, boolean> = {
    remove: true,
    hold: pkg.status !== "held",
    unhold: pkg.status === "held",
    upgrade:
      !!pkg.available_version && pkg.available_version !== pkg.current_version,
    downgrade: pkg.status !== "held",
  };

  const handlePackageAction = (action: InstalledPackageAction) => {
    setPageParams({
      sidePath: [...sidePath, action],
      name: pkg.name,
    });
  };

  const actions: Action[] = Object.keys(INSTALLED_PACKAGE_ACTIONS)
    .map((key) => key as InstalledPackageAction)
    .filter(
      (packageAction) =>
        buttonRenderCondition[packageAction] &&
        INSTALLED_PACKAGE_ACTIONS[packageAction].appearance == "positive",
    )
    .sort(
      (a, b) =>
        INSTALLED_PACKAGE_ACTIONS[b].order - INSTALLED_PACKAGE_ACTIONS[a].order,
    )
    .map((packageAction) => {
      return {
        icon: INSTALLED_PACKAGE_ACTIONS[packageAction].icon,
        label: INSTALLED_PACKAGE_ACTIONS[packageAction].label,
        "aria-label": `${INSTALLED_PACKAGE_ACTIONS[packageAction].label} ${pkg.name} package`,
        onClick: () => {
          handlePackageAction(packageAction);
        },
      };
    });

  const destructiveActions: Action[] = Object.keys(INSTALLED_PACKAGE_ACTIONS)
    .map((key) => key as InstalledPackageAction)
    .filter(
      (packageAction) =>
        buttonRenderCondition[packageAction] &&
        INSTALLED_PACKAGE_ACTIONS[packageAction].appearance == "negative",
    )
    .sort(
      (a, b) =>
        INSTALLED_PACKAGE_ACTIONS[b].order - INSTALLED_PACKAGE_ACTIONS[a].order,
    )
    .map((packageAction) => {
      return {
        icon: INSTALLED_PACKAGE_ACTIONS[packageAction].icon,
        label: INSTALLED_PACKAGE_ACTIONS[packageAction].label,
        "aria-label": `${INSTALLED_PACKAGE_ACTIONS[packageAction].label} ${pkg.name} package`,
        onClick: () => {
          handlePackageAction(packageAction);
        },
      };
    });

  return (
    <ListActions
      toggleAriaLabel={`${pkg.name} package actions`}
      actions={actions}
      destructiveActions={destructiveActions}
    />
  );
};

export default PackageListActions;
