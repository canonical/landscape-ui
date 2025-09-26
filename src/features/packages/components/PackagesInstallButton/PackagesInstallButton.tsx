import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { ButtonProps } from "@canonical/react-components";
import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import { lazy, Suspense, type FC } from "react";
import classes from "./PackagesInstallButton.module.scss";

const PackagesInstallForm = lazy(async () => import("../PackagesInstallForm"));

type PackagesInstallButtonProps = Pick<ButtonProps, "appearance">;

const PackagesInstallButton: FC<PackagesInstallButtonProps> = ({
  appearance,
}) => {
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
      appearance={appearance}
    >
      <Icon name="plus" light={appearance === "positive"} />
      <span>Install</span>
    </Button>
  );
};

export default PackagesInstallButton;
