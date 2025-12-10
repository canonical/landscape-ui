import type { FC, ReactNode } from "react";
import useNotify from "@/hooks/useNotify";
import AppNotification from "@/components/layout/AppNotification";

export const GlobalShell: FC<{ readonly children: ReactNode }> = ({
  children,
}) => {
  const { notify, sidePanel } = useNotify();

  const showNotification =
    !sidePanel.open || notify.notification?.type !== "negative";

  return (
    <>
      {showNotification && <AppNotification notify={notify} />}
      {children}
    </>
  );
};
