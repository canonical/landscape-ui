import type { ComponentProps, FC } from "react";
import { lazy, Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";

const SingleRemovalProfileFormComponent = lazy(
  () => import("./components/SingleRemovalProfileForm"),
);

export const SingleRemovalProfileForm: FC<
  ComponentProps<typeof SingleRemovalProfileFormComponent>
> = (props) => {
  return (
    <Suspense fallback={<LoadingState />}>
      <SingleRemovalProfileFormComponent {...props} />
    </Suspense>
  );
};

export { default as RemovalProfileList } from "./components/RemovalProfileList";
export { default as RemovalProfilesEmptyState } from "./components/RemovalProfilesEmptyState";
export { default as RemovalProfilesHeader } from "./components/RemovalProfilesHeader";
export type { RemovalProfile } from "./types";
export { useRemovalProfiles } from "./hooks";
