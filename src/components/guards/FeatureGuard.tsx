import type { FC, ReactNode } from "react";
import { Navigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import { HOMEPAGE_PATH } from "@/constants";
import type { FeatureKey } from "@/types/FeatureKey";

interface Props {
  readonly feature: FeatureKey;
  readonly children: ReactNode;
  readonly fallbackPath?: string;
}

export const FeatureGuard: FC<Props> = ({
  feature,
  children,
  fallbackPath = HOMEPAGE_PATH,
}) => {
  const { isFeatureEnabled } = useAuth();

  if (!isFeatureEnabled(feature)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
