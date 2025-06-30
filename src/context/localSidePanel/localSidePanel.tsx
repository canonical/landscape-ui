import { Button, Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { createContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useBoolean } from "usehooks-ts";

interface LocalSidePanelProps {
  children: ReactNode;
  close: () => void;
  title: ReactNode;
}

export const LocalSidePanelContext = createContext<FC<LocalSidePanelProps>>(
  () => undefined,
);

interface LocalSidePanelProviderProps {
  readonly children?: ReactNode;
}

const LocalSidePanelProvider: FC<LocalSidePanelProviderProps> = ({
  children,
}) => {
  const ref = useRef<HTMLElement>(null);

  const {
    value: isCollapsed,
    setTrue: collapse,
    setFalse: open,
  } = useBoolean(true);

  return (
    <LocalSidePanelContext
      value={({ children: content, close, title }) => {
        useEffect(() => {
          open();

          return () => {
            collapse();
          };
        }, []);

        return ref.current
          ? createPortal(
              <>
                <div className="p-panel__header">
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
                <div className="p-panel__content">
                  <div className="p-panel__inner">{content}</div>
                </div>
              </>,
              ref.current,
            )
          : undefined;
      }}
    >
      {children}
      <aside
        className={classNames("l-aside", {
          "is-collapsed": isCollapsed,
        })}
        ref={ref}
      />
    </LocalSidePanelContext>
  );
};

export default LocalSidePanelProvider;
