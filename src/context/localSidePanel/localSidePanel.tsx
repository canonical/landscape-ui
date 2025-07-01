import { Button, Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { createContext, useRef } from "react";
import { createPortal } from "react-dom";
import classes from "./LocalSidePanelProvider.module.scss";

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

  return (
    <LocalSidePanelContext
      value={({ children: content, close, title }) => {
        return ref.current
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
                <div
                  className={classNames("p-panel__content", classes.outerDiv)}
                >
                  <div
                    className={classNames("p-panel__inner", classes.innerDiv)}
                  >
                    {content}
                  </div>
                </div>
              </>,
              ref.current,
            )
          : undefined;
      }}
    >
      {children}
      <aside className={classNames("l-aside", classes.container)} ref={ref} />
    </LocalSidePanelContext>
  );
};

export default LocalSidePanelProvider;
