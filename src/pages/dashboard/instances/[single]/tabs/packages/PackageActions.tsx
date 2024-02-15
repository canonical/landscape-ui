import { FC } from "react";
import InstalledPackagesActionForm from "./InstalledPackagesActionForm";
import useSidePanel from "../../../../../../hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import PackagesInstallForm from "./PackagesInstallForm";
import classes from "./PackageActions.module.scss";
import { Package } from "../../../../../../types/Package";
import classNames from "classnames";

interface PackageActionsProps {
  selectedPackages: Package[];
  query: string;
}

const PackageActions: FC<PackageActionsProps> = ({
  selectedPackages,
  query,
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
        query={query}
      />,
    );
  };

  const handleInstallPackages = () => {
    setSidePanelContent(
      "Install packages",
      <PackagesInstallForm query={query} />,
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
            selectedPackages.every(
              (pkg) => pkg.computers.installed.length === 0,
            )
          }
          onClick={() => {
            handleExistingPackages("remove");
          }}
        >
          <i className="p-icon--delete" />
          <span>Uninstall</span>
        </Button>
        <Button
          type="button"
          className="p-segmented-control__button has-icon"
          disabled={
            0 === selectedPackages.length ||
            selectedPackages.every((pkg) => pkg.computers.upgrades.length === 0)
          }
          onClick={() => {
            handleExistingPackages("upgrade");
          }}
        >
          <i className="p-icon--change-version" />
          <span>Upgrade</span>
        </Button>
      </div>
    </div>
  );
};

export default PackageActions;
