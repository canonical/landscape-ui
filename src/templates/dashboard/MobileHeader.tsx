import type { FC } from "react";
import { Link } from "react-router";
import { Button } from "@canonical/react-components";
import Logo from "../../assets/images/logo-white-full.svg";
import { APP_TITLE } from "@/constants";

interface MobileHeaderProps {
  readonly toggleMenu: () => void;
}

const MobileHeader: FC<MobileHeaderProps> = ({ toggleMenu }) => {
  return (
    <div className="p-panel__header">
      <Link to="/">
        <img
          className="p-panel__logo-name is-fading-when-collapsed"
          src={Logo}
          alt={APP_TITLE}
          width={9 * 16}
        />
      </Link>
      <div className="p-panel__controls u-no-padding--top">
        <Button
          type="button"
          className="p-panel__toggle"
          dense
          onClick={toggleMenu}
        >
          Menu
        </Button>
      </div>
    </div>
  );
};

export default MobileHeader;
