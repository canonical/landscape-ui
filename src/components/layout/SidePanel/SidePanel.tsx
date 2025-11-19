import ApplicationIdContext from "@/context/applicationId";
import type { SidePanelProps as SidePanelBaseProps } from "@canonical/react-components";
import { SidePanel as SidePanelBase } from "@canonical/react-components";
import classNames from "classnames";
import type { ReactNode } from "react";
import { useContext, type FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackComponent } from "../AppErrorBoundary/FallbackComponent";
import CloseContext from "./CloseContext";
import Content from "./Content";
import type { HeaderProps } from "./Header";
import Header from "./Header";
import LoadingState from "./LoadingState";
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
      className={classNames(
        classes.sidePanel,
        size !== "small" && classes[size],
      )}
      parentId={parentId}
      isAnimated
      {...props}
    >
      <CloseContext value={onClose}>
        <ErrorBoundary
          FallbackComponent={(fallbackProps) => (
            <>
              <Header />
              <Content>
                <FallbackComponent {...fallbackProps} />
              </Content>
            </>
          )}
        >
          {children}
        </ErrorBoundary>
      </CloseContext>
    </SidePanelBase>
  );
};

SidePanel.Content = Content;
SidePanel.Header = Header;
SidePanel.LoadingState = LoadingState;
SidePanel.Suspense = Suspense;
export default SidePanel;
