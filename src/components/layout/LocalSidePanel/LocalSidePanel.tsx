import useLocalSidePanel from "@/hooks/useLocalSidePanel";
import { Button, Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import classes from "./LocalSidePanel.module.scss";

interface LocalSidePanelProps {
  children: ReactNode;
  close: () => void;
  title: ReactNode;
}

const LocalSidePanel: FC<LocalSidePanelProps> = ({
  children: content,
  close,
  title,
}) => {
  const localSidePanelRef = useLocalSidePanel();

  return localSidePanelRef.current
    ? createPortal(
        <>
          <div className={classNames("p-panel__header", classes.header)}>
            <h3 className="p-panel__title">{title}</h3>
            <div className="p-panel__controls">
              <Button
                type="button"
                onClick={close}
                className="p-button--base u-no-margin--bottom has-icon"
                aria-label="Close side panel"
              >
                <Icon name={ICONS.close} />
              </Button>
            </div>
          </div>
          <div className={classNames("p-panel__content", classes.outerDiv)}>
            <div className={classNames("p-panel__inner", classes.innerDiv)}>
              {content}
            </div>
          </div>
        </>,
        localSidePanelRef.current,
      )
    : undefined;
};

export default LocalSidePanel;
