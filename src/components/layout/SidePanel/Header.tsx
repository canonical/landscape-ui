import { Button, Icon, SidePanel } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import { useContext } from "react";
import OnCloseContext from "./OnCloseContext";

export interface HeaderProps {
  readonly children?: ReactNode;
}

const Header: FC<HeaderProps> = ({ children }) => {
  const onClose = useContext(OnCloseContext);

  return (
    <SidePanel.Header>
      <SidePanel.HeaderTitle>{children}</SidePanel.HeaderTitle>
      <SidePanel.HeaderControls>
        <Button appearance="base" hasIcon onClick={onClose}>
          <Icon name="close" />
        </Button>
      </SidePanel.HeaderControls>
    </SidePanel.Header>
  );
};

export default Header;
