import type { FC } from "react";
import LoadingStateBase from "../LoadingState";
import SidePanel from "./SidePanel";

const LoadingState: FC = () => (
  <SidePanel.Content>
    <LoadingStateBase />
  </SidePanel.Content>
);

export default LoadingState;
