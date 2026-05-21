import usePageParams from "@/hooks/usePageParams";
import type { ButtonProps } from "@canonical/react-components";
import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import classes from "./PackagesInstallButton.module.scss";

type PackagesInstallButtonProps = Pick<ButtonProps, "appearance">;

const PackagesInstallButton: FC<PackagesInstallButtonProps> = ({
  appearance,
}) => {
  const { createSidePathPusher } = usePageParams();

  return (
    <Button
      type="button"
      onClick={createSidePathPusher("install")}
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
