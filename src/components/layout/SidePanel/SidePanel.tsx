import ApplicationIdContext from "@/context/applicationId";
import type { SidePanelProps as SidePanelBaseProps } from "@canonical/react-components";
import { SidePanel as SidePanelBase } from "@canonical/react-components";
import type { ReactNode } from "react";
import { useContext, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackComponent } from "../AppErrorBoundary/FallbackComponent";
import type { HeaderProps } from "./Header";
import Header from "./Header";
import LoadingState from "./LoadingState";
import OnCloseContext from "./OnCloseContext";
import classes from "./SidePanel.module.scss";
import type { SuspenseProps } from "./Suspense";
import Suspense from "./Suspense";

interface SidePanelProps extends SidePanelBaseProps {
  readonly children: ReactNode;
  readonly onClose: () => void;
  readonly size?: "small" | "medium" | "large";
}

const SidePanel: FC<SidePanelProps> & {
  Content: typeof SidePanelBase.Content;
  Header: FC<HeaderProps>;
  LoadingState: FC;
  Suspense: FC<SuspenseProps>;
} = ({ children, onClose, size = "small", ...props }: SidePanelProps) => {
  const parentId = useContext(ApplicationIdContext);

  return (
    <SidePanelBase
      className={classes[size]}
      parentId={parentId}
      isAnimated
      {...props}
    >
      <OnCloseContext value={onClose}>
        <ErrorBoundary
          FallbackComponent={(fallbackProps) => (
            <Header>
              <FallbackComponent {...fallbackProps} />
            </Header>
          )}
        >
          {children}
        </ErrorBoundary>
      </OnCloseContext>
    </SidePanelBase>
  );
};

SidePanel.Content = SidePanelBase.Content;
SidePanel.Header = Header;
SidePanel.LoadingState = LoadingState;
SidePanel.Suspense = Suspense;
export default SidePanel;
