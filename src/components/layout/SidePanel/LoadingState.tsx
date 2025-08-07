import type { FC } from "react";
import LoadingStateBase from "../LoadingState";
import SidePanel from "./SidePanel";

const LoadingState: FC = () => {
  return (
    <SidePanel.Body>
      <LoadingStateBase />
    </SidePanel.Body>
  );
};

export default LoadingState;
