import type { FC } from "react";
import { Button, Icon } from "@canonical/react-components";
import { Link } from "react-router";
import classes from "./DesktopHeader.module.scss";
import classNames from "classnames";
import { logoWhite, logoWhiteIcon } from "@landscape/assets";

interface DesktopHeaderProps {
  readonly closeMenu: () => void;
}

const DesktopHeader: FC<DesktopHeaderProps> = ({ closeMenu }) => {
  return (
    <div
      className={classNames(
        "p-panel__header is-sticky u-no-padding--left u-no-padding--right",
        classes.container,
      )}
    >
      <Link to="/" className={classes.link}>
        <img
          className={classNames("is-fading-when-collapsed", classes.logoImg)}
          src={logoWhite}
          alt={"Landscape"}
          width={9 * 16}
        />
        <img
          className={classes.logoIcon}
          src={logoWhiteIcon}
          alt={"Landscape"}
          width={1.6 * 16}
        />
      </Link>
      <div className="u-hide--large">
        <Button
          type="button"
          className="p-button--base is-dark u-no-margin u-hide--medium"
          hasIcon
          onClick={(event) => {
            closeMenu();
            event.currentTarget.blur();
          }}
          aria-label="Close navigation"
        >
          <Icon name="close-sidebar" className="is-light" />
        </Button>
      </div>
    </div>
  );
};

export default DesktopHeader;
