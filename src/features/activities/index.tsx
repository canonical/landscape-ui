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

export { useGetActivities } from "./api";
export { default as Activities } from "./components/Activities";
export { default as ActivitiesActions } from "./components/ActivitiesActions";
export { ACTIVITY_STATUSES } from "./constants";
export { useActivities } from "./hooks";
export type { Activity, ActivityCommon, GetActivitiesParams } from "./types";
