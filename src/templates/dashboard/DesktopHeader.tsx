import { FC } from "react";
import { Button } from "@canonical/react-components";
import { Link } from "react-router-dom";
import LogoIcon from "../../assets/images/logo-icon.svg";
import Logo from "../../assets/images/logo-white.svg";
import { APP_TITLE } from "../../constants";

interface DesktopHeaderProps {
  closeMenu: () => void;
}

const DesktopHeader: FC<DesktopHeaderProps> = ({ closeMenu }) => {
  return (
    <div className="p-panel__header is-sticky">
      <Link className="p-panel__logo" to="/">
        <img
          className="p-panel__logo-icon"
          src={LogoIcon}
          alt={APP_TITLE}
          width={24}
          height={24}
        />
        <img
          className="p-panel__logo-name is-fading-when-collapsed"
          src={Logo}
          alt={APP_TITLE}
          height={16}
        />
      </Link>
      <div className="p-panel__controls u-hide--large">
        <Button
          className="p-button--base is-dark u-no-margin u-hide--medium"
          hasIcon
          onClick={closeMenu}
          aria-label="Close navigation"
        >
          <i className="is-light p-icon--close" />
        </Button>
      </div>
    </div>
  );
};

export default DesktopHeader;
