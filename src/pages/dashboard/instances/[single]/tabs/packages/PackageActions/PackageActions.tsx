import { FC } from "react";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import { Package } from "@/types/Package";
import classNames from "classnames";
import InstalledPackagesActionForm from "@/pages/dashboard/instances/[single]/tabs/packages/InstalledPackagesActionForm";
import PackagesInstallForm from "@/pages/dashboard/instances/[single]/tabs/packages/PackagesInstallForm";
import classes from "./PackageActions.module.scss";
import { Instance } from "@/types/Instance";

interface PackageActionsProps {
  instance: Instance;
  selectedPackages: Package[];
}

const PackageActions: FC<PackageActionsProps> = ({
  instance,
  selectedPackages,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const handleExistingPackages = (action: "remove" | "upgrade") => {
    const titleEnding =
      selectedPackages.length === 1
        ? selectedPackages[0].name
        : `${selectedPackages.length} selected packages`;

    setSidePanelContent(
      "remove" === action ? `Remove ${titleEnding}` : `Upgrade ${titleEnding}`,
      <InstalledPackagesActionForm
        action={action}
        packages={selectedPackages}
        instanceId={instance.id}
      />,
    );
  };

  const handleInstallPackages = () => {
    setSidePanelContent(
      "Install packages",
      <PackagesInstallForm instanceId={instance.id} />,
    );
  };

  return (
    <div className={classes.container}>
      <Button
        type="button"
        onClick={handleInstallPackages}
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
        <Button
          type="button"
          className="p-segmented-control__button has-icon"
          disabled={
            0 === selectedPackages.length ||
            selectedPackages.every((pkg) => !pkg.current_version)
          }
          onClick={() => handleExistingPackages("remove")}
        >
          <i className="p-icon--delete" />
          <span>Uninstall</span>
        </Button>
        <Button
          type="button"
          className="p-segmented-control__button has-icon"
          disabled={
            0 === selectedPackages.length ||
            selectedPackages.every((pkg) => !pkg.available_version)
          }
          onClick={() => handleExistingPackages("upgrade")}
        >
          <i className="p-icon--change-version" />
          <span>Upgrade</span>
        </Button>
      </div>
    </div>
  );
};

export default PackageActions;
