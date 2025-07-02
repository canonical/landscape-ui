import type { FC, ReactNode } from "react";
import { FallbackComponent } from "./FallbackComponent";
import { ErrorBoundary } from "react-error-boundary";

interface AppErrorBoundaryProps {
  readonly children: ReactNode;
}

const AppErrorBoundary: FC<AppErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
