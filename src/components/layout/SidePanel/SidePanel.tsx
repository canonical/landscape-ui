import { LocalSidePanelContext } from "@/context/localSidePanel";
import { Button, Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import { useContext, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AppErrorBoundary } from "../AppErrorBoundary";
import classes from "./SidePanel.module.scss";

interface SidePanelProps {
  children: ReactNode;
  onClose: () => void;
  size: "small" | "medium" | "large";
  title: ReactNode;
  closeButtonAriaLabel?: string;
  expanded?: boolean;
}

const SidePanel: FC<SidePanelProps> = ({
  children,
  closeButtonAriaLabel = "Close side panel",
  expanded,
  onClose,
  size,
  title,
}) => {
  const sidePanel = useContext(LocalSidePanelContext);

  if (sidePanel && expanded) {
    return createPortal(
      <>
        <div className={classNames("p-panel__header", classes.header)}>
          <h3 className="p-panel__title">{title}</h3>

          <div className="p-panel__controls">
            <Button
              type="button"
              onClick={onClose}
              className="p-button--base u-no-margin--bottom has-icon"
              aria-label={closeButtonAriaLabel}
            >
              <Icon name={ICONS.close} />
            </Button>
          </div>
        </div>

        <div
          className={classNames("p-panel__content", classes.outerDiv, {
            [classes.medium]: size === "medium",
            [classes.large]: size === "large",
          })}
        >
          <div className={classNames("p-panel__inner", classes.innerDiv)}>
            <AppErrorBoundary>{children}</AppErrorBoundary>
          </div>
        </div>
      </>,

      sidePanel,
    );
  }
};

export default SidePanel;
