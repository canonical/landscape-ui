import { Button, Icon, SidePanel } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import { useContext } from "react";
import CloseContext from "../context/CloseContext";

interface HeaderTitleProps {
  readonly children: ReactNode;
  readonly title?: ReactNode;
}

const Body: FC<HeaderTitleProps> = ({ children, title }) => {
  const close = useContext(CloseContext);

  return (
    <>
      <SidePanel.Header>
        <SidePanel.HeaderTitle>{title}</SidePanel.HeaderTitle>

        <SidePanel.HeaderControls>
          <Button appearance="base" hasIcon onClick={close}>
            <Icon name="close" />
          </Button>
        </SidePanel.HeaderControls>
      </SidePanel.Header>

      <SidePanel.Content>{children}</SidePanel.Content>
    </>
  );
};

export default Body;
