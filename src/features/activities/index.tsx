import LoadingState from "@/components/layout/LoadingState";
import type { ComponentProps, FC } from "react";
import { lazy, Suspense } from "react";

const ActivityDetailsComponent = lazy(
  () => import("./components/ActivityDetails"),
);

export const ActivityDetails: FC<
  ComponentProps<typeof ActivityDetailsComponent>
> = (props) => {
  return (
    <Suspense fallback={<LoadingState />}>
      <ActivityDetailsComponent {...props} />
    </Suspense>
  );
};

export * from "./api";
export { default as Activities } from "./components/Activities";
export { default as ActivitiesActions } from "./components/ActivitiesActions";
export { default as ActivitiesContainer } from "./components/ActivitiesContainer";
export { default as ActivitiesEmptyState } from "./components/ActivitiesEmptyState";
export { default as ActivitiesList } from "./components/ActivitiesList";
export { default as ActivitiesPanel } from "./components/ActivitiesPanel/ActivitiesPanel";
export { default as ActivityDetailsLink } from "./components/ActivityDetailsLink";
export { ACTIVITY_STATUSES } from "./constants";
export { useOpenActivityDetails, useOpenActivityDetailsPanel } from "./hooks";
export type {
  Activity,
  ActivityCommon,
  ActivityGroup,
  GetActivitiesParams,
  ActivityStatus,
} from "./types";
