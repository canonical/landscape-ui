import type { FC, ReactNode } from "react";
import { FallbackComponent } from "./FallbackComponent";
import * as Sentry from "@sentry/react";

interface AppErrorBoundaryProps {
  readonly children: ReactNode;
}

const AppErrorBoundary: FC<AppErrorBoundaryProps> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary fallback={FallbackComponent}>
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default AppErrorBoundary;
