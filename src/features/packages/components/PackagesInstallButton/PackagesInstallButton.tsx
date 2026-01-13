import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import type { ButtonProps } from "@canonical/react-components";
import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import { lazy, Suspense, type FC } from "react";
import { useParams } from "react-router";
import classes from "./PackagesInstallButton.module.scss";

const PackagesActionForm = lazy(async () => import("../PackagesActionForm"));

type PackagesInstallButtonProps = Pick<ButtonProps, "appearance">;

const PackagesInstallButton: FC<PackagesInstallButtonProps> = ({
  appearance,
}) => {
  const { setSidePanelContent } = useSidePanel();
  const { instanceId: parentInstanceId, childInstanceId } =
    useParams<UrlParams>();

  const handlePackagesInstall = () => {
    const instanceId = childInstanceId ?? parentInstanceId;

    if (instanceId === undefined) {
      throw new Error();
    }

    setSidePanelContent(
      "Install packages",
      <Suspense fallback={<LoadingState />}>
        <PackagesActionForm instanceIds={[parseInt(instanceId)]} action={"install"}/>
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
