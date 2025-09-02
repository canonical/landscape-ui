import { Button, Icon, SidePanel } from "@canonical/react-components";
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
        <Button appearance="base" hasIcon onClick={close} aria-label="Close">
          <Icon name="close" />
        </Button>
      </SidePanel.HeaderControls>
    </SidePanel.Header>
  );
};

export default Header;
