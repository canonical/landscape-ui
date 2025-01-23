import { FC } from "react";
import { Button, Icon } from "@canonical/react-components";
import { Link } from "react-router";
import Logo from "../../assets/images/logo-white-full.svg";
import LogoIcon from "../../assets/images/logo-white-icon.svg";
import { APP_TITLE, ROOT_PATH } from "../../constants";
import classes from "./DesktopHeader.module.scss";
import classNames from "classnames";

interface DesktopHeaderProps {
  closeMenu: () => void;
}

const DesktopHeader: FC<DesktopHeaderProps> = ({ closeMenu }) => {
  return (
    <div
      className={classNames(
        "p-panel__header is-sticky u-no-padding--left u-no-padding--right",
        classes.container,
      )}
    >
      <Link to={ROOT_PATH} className={classes.link}>
        <img
          className={classNames("is-fading-when-collapsed", classes.logoImg)}
          src={Logo}
          alt={APP_TITLE}
          width={9 * 16}
        />
        <img
          className={classes.logoIcon}
          src={LogoIcon}
          alt={APP_TITLE}
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
