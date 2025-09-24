import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import classNames from "classnames";
import { lazy, Suspense, type FC } from "react";
import classes from "./PackagesInstallButton.module.scss";

const PackagesInstallForm = lazy(async () => import("../PackagesInstallForm"));

const PackagesInstallButton: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handlePackagesInstall = () => {
    setSidePanelContent(
      "Install packages",
      <Suspense fallback={<LoadingState />}>
        <PackagesInstallForm />
      </Suspense>,
    );
  };

  return (
    <Button
      type="button"
      onClick={handlePackagesInstall}
      hasIcon
      className={classNames("u-no-margin--bottom", classes.noWrap)}
    >
      <i className="p-icon--plus" />
      <span>Install</span>
    </Button>
  );
};

export default PackagesInstallButton;
