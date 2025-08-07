import ApplicationIdContext from "@/context/applicationId";
import type { SidePanelProps as SidePanelPropsBase } from "@canonical/react-components";
import { SidePanel as SidePanelBase } from "@canonical/react-components";
import type { Key } from "react";
import { Suspense, useContext, type FC } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { FallbackComponent as FallbackComponentBase } from "../AppErrorBoundary/FallbackComponent";
import type { BodyProps } from "./Body";
import Body from "./Body";
import CloseContext from "./CloseContext";
import LoadingState from "./LoadingState";
import classes from "./SidePanel.module.scss";

interface SidePanelProps extends Omit<SidePanelPropsBase, "parentId"> {
  readonly close: () => void;
  readonly key: Key;
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
} = ({ children, close, key, size = "small", ...props }: SidePanelProps) => {
  const parentId = useContext(ApplicationIdContext);

  return (
    <SidePanelBase className={classes[size]} parentId={parentId} {...props}>
      <CloseContext value={close}>
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <Suspense fallback={<LoadingState />} key={key}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </CloseContext>
    </SidePanelBase>
  );
};

SidePanel.Body = Body;
SidePanel.LoadingState = LoadingState;
export default SidePanel;
