import { LocalSidePanelContext } from "@/context/localSidePanel";
import { Button, Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import { useContext, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";
import classes from "./LocalSidePanel.module.scss";

interface LocalSidePanelProps {
  children: ReactNode;
  onClose: () => void;
  title: ReactNode;
  closeButtonAriaLabel?: string;
  expanded?: boolean;
}

const LocalSidePanel: FC<LocalSidePanelProps> = ({
  children,
  closeButtonAriaLabel = "Close side panel",
  expanded,
  onClose,
  title,
}) => {
  const applicationAside = useContext(LocalSidePanelContext);

  if (applicationAside && expanded) {
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

        <div className={classNames("p-panel__content", classes.outerDiv)}>
          <div className={classNames("p-panel__inner", classes.innerDiv)}>
            {children}
          </div>
        </div>
      </>,

      applicationAside,
    );
  }
};

export default LocalSidePanel;
