import classNames from "classnames";
import type { FC, ReactNode } from "react";
import { createContext, useState } from "react";
import classes from "./LocalSidePanelProvider.module.scss";

export const LocalSidePanelContext = createContext<HTMLElement | null>(null);

interface LocalSidePanelProviderProps {
  readonly children?: ReactNode;
}

const LocalSidePanelProvider: FC<LocalSidePanelProviderProps> = ({
  children,
}) => {
  const [sidePanel, setSidePanel] = useState<HTMLElement | null>(null);

  return (
    <LocalSidePanelContext value={sidePanel}>
      {children}
      <aside
        className={classNames("l-aside", classes.container)}
        ref={setSidePanel}
      />
    </LocalSidePanelContext>
  );
};

export default LocalSidePanelProvider;
