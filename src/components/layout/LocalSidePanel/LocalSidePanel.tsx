import ApplicationIdContext from "@/context/applicationId";
import type { SidePanelProps } from "@canonical/react-components";
import { SidePanel } from "@canonical/react-components";
import { useContext, type FC } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { FallbackComponent } from "../AppErrorBoundary/FallbackComponent";
import classes from "./LocalSidePanel.module.scss";
import Body from "./components/Body";
import CloseContext from "./context/CloseContext";

interface LocalSidePanelProps extends Omit<SidePanelProps, "parentId"> {
  readonly close: () => void;
  readonly size?: "small" | "medium" | "large";
}

const LocalSidePanelFallbackComponent: FC<FallbackProps> = (props) => {
  return (
    <Body>
      <FallbackComponent {...props} />
    </Body>
  );
};

const LocalSidePanel: FC<LocalSidePanelProps> = ({
  children,
  close,
  size = "small",
  ...props
}) => {
  const parentId = useContext(ApplicationIdContext);

  return (
    <SidePanel className={classes[size]} parentId={parentId} {...props}>
      <CloseContext value={close}>
        <ErrorBoundary FallbackComponent={LocalSidePanelFallbackComponent}>
          {children}
        </ErrorBoundary>
      </CloseContext>
    </SidePanel>
  );
};

export default LocalSidePanel;
