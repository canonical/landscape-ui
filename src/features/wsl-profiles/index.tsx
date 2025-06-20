import LoadingState from "@/components/layout/LoadingState";
import type { ComponentProps, FC } from "react";
import { lazy, Suspense } from "react";

export { useGetWslProfiles } from "./api";
export { default as WslProfilesEmptyState } from "./components/WslProfilesEmptyState";
export { default as WslProfilesHeader } from "./components/WslProfilesHeader";
export { default as WslProfilesList } from "./components/WslProfilesList";
export type { WslProfile } from "./types";

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
