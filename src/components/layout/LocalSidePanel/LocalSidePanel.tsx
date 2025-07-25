import ApplicationIdContext from "@/context/applicationId";
import type { SidePanelProps } from "@canonical/react-components";
import { SidePanel } from "@canonical/react-components";
import { useContext, type FC } from "react";
import { AppErrorBoundary } from "../AppErrorBoundary";
import classes from "./LocalSidePanel.module.scss";

interface LocalSidePanelProps extends Omit<SidePanelProps, "parentId"> {
  readonly size?: "small" | "medium" | "large";
}

const LocalSidePanel: FC<LocalSidePanelProps> = ({
  children,
  size = "small",
  ...props
}) => {
  const parentId = useContext(ApplicationIdContext);

  return (
    <SidePanel className={classes[size]} parentId={parentId} {...props}>
      <AppErrorBoundary>{children}</AppErrorBoundary>
    </SidePanel>
  );
};

export default LocalSidePanel;
