import classNames from "classnames";
import type { FC, ReactNode, RefObject } from "react";
import { createContext, useRef } from "react";
import classes from "./LocalSidePanelProvider.module.scss";

export const LocalSidePanelContext = createContext<
  RefObject<HTMLElement | null>
>({ current: null });

interface LocalSidePanelProviderProps {
  readonly children?: ReactNode;
}

const LocalSidePanelProvider: FC<LocalSidePanelProviderProps> = ({
  children,
}) => {
  const ref = useRef<HTMLElement>(null);

  return (
    <LocalSidePanelContext value={ref}>
      {children}
      <aside className={classNames("l-aside", classes.container)} ref={ref} />
    </LocalSidePanelContext>
  );
};

export default LocalSidePanelProvider;
