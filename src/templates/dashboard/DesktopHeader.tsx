import { FC } from "react";
import { Button } from "@canonical/react-components";
import { Link } from "react-router-dom";
import TagIcon from "../../assets/images/logo-icon-landscape.svg";
import Logo from "../../assets/images/logo-canonical.svg";
import { APP_TITLE } from "../../constants";
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
      <Link className={classes.link} to="/">
        <div className={classes.tag}>
          <img src={TagIcon} alt={APP_TITLE} width={16} height={16} />
        </div>
        <img
          className={classNames("is-fading-when-collapsed", classes.logoImg)}
          src={Logo}
          alt={APP_TITLE}
          width={39}
          height={7}
        />
        <span
          className={classNames(
            "is-fading-when-collapsed p-heading--4",
            classes.logoTitle,
          )}
        >
          Landscape
        </span>
      </Link>
      <div className="u-hide--large">
        <Button
          className="p-button--base is-dark u-no-margin u-hide--medium"
          hasIcon
          onClick={closeMenu}
          aria-label="Close navigation"
        >
          <i className="is-light p-icon--close-sidebar" />
        </Button>
      </div>
    </div>
  );
};

export default DesktopHeader;
