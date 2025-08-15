import ApplicationIdContext from "@/context/applicationId";
import { SidePanel as SidePanelBase } from "@canonical/react-components";
import type { ReactNode } from "react";
import { useContext, type FC } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { FallbackComponent as FallbackComponentBase } from "../AppErrorBoundary/FallbackComponent";
import type { BodyProps } from "./Body";
import Body from "./Body";
import CloseContext from "./CloseContext";
import LoadingState from "./LoadingState";
import classes from "./SidePanel.module.scss";
import type { SuspenseProps } from "./Suspense";
import Suspense from "./Suspense";

interface SidePanelProps {
  readonly children: ReactNode;
  readonly close: () => void;
  readonly isOpen: boolean;
  readonly size?: "small" | "medium" | "large";
}

const FallbackComponent: FC<FallbackProps> = (props) => {
  return (
    <Body>
      <FallbackComponentBase {...props} />
    </Body>
  );
};

const SidePanel: FC<SidePanelProps> & {
  Body: FC<BodyProps>;
  LoadingState: FC;
  Suspense: FC<SuspenseProps>;
} = ({ children, close, size = "small", ...props }: SidePanelProps) => {
  const parentId = useContext(ApplicationIdContext);

  return (
    <SidePanelBase
      className={classes[size]}
      parentId={parentId}
      isAnimated
      {...props}
    >
      <CloseContext value={close}>
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          {children}
        </ErrorBoundary>
      </CloseContext>
    </SidePanelBase>
  );
};

SidePanel.Body = Body;
SidePanel.LoadingState = LoadingState;
SidePanel.Suspense = Suspense;
export default SidePanel;
