import useNavigateWithSearch from "@/hooks/useNavigateWithSearch";
import { Button, Icon, SidePanel } from "@canonical/react-components";
import type { FC, ReactNode } from "react";

interface HeaderProps {
  readonly root: string;
  readonly title?: ReactNode;
}

const Header: FC<HeaderProps> = ({ root, title }) => {
  const navigateWithSearch = useNavigateWithSearch();

  const close = () => {
    navigateWithSearch(root);
  };

  return (
    <SidePanel.Header>
      <SidePanel.HeaderTitle>{title}</SidePanel.HeaderTitle>

      <SidePanel.HeaderControls>
        <Button appearance="base" hasIcon onClick={close}>
          <Icon name="close" />
        </Button>
      </SidePanel.HeaderControls>
    </SidePanel.Header>
  );
};

export default Header;
