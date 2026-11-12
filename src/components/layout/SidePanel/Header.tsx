import { SidePanel } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import type { FC, ReactNode } from "react";
import { useContext } from "react";
import CloseContext from "./CloseContext";

export interface HeaderProps {
  readonly children?: ReactNode;
}

const Header: FC<HeaderProps> = ({ children }) => {
  const close = useContext(CloseContext);

  return (
    <SidePanel.Header>
      <SidePanel.HeaderTitle>{children}</SidePanel.HeaderTitle>
      <SidePanel.HeaderControls>
        <Button
          type="button"
          importance="tertiary"
          icon="close"
          onClick={close}
          aria-label="Close"
        />
      </SidePanel.HeaderControls>
    </SidePanel.Header>
  );
};

export default Header;
