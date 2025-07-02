import type { ComponentProps, FC } from "react";
import { lazy, Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";

export { default as WslProfilesEmptyState } from "./components/WslProfilesEmptyState";
export { default as WslProfilesList } from "./components/WslProfilesList";
export { default as WslProfilesHeader } from "./components/WslProfilesHeader";
export type { WslProfile } from "./types";
export { useWslProfiles } from "./hooks";

const WslProfileInstallFormComponent = lazy(
  () => import("./components/WslProfileInstallForm"),
);

export const WslProfileInstallForm: FC<
  ComponentProps<typeof WslProfileInstallFormComponent>
> = (props) => {
  return (
    <Suspense fallback={<LoadingState />}>
      <WslProfileInstallFormComponent {...props} />
    </Suspense>
  );
};
