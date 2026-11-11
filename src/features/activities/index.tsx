import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import type { ComponentProps, FC } from "react";
import { lazy, Suspense } from "react";

const ActivityDetailsComponent = lazy(
  () => import("./components/ActivityDetails"),
);

export const ActivityDetails: FC<
  ComponentProps<typeof ActivityDetailsComponent>
> = (props) => {
  return (
    <Suspense
      fallback={
        props.renderInSidePanel ? <SidePanel.LoadingState /> : <LoadingState />
      }
    >
      <ActivityDetailsComponent {...props} />
    </Suspense>
  );
};

export {
  useApproveActivities,
  useCancelActivities,
  useGetActivities,
  useGetActivityParents,
  useGetActivityTypes,
  useGetSingleActivity,
  useRedoActivities,
} from "./api";
export { default as Activities } from "./components/Activities";
export { default as ActivitiesActions } from "./components/ActivitiesActions";
export { default as ActivitiesContainer } from "./components/ActivitiesContainer";
export { default as ActivitiesDateFilter } from "./components/ActivitiesDateFilter";
export { default as ActivitiesEmptyState } from "./components/ActivitiesEmptyState";
export { default as ActivitiesList } from "./components/ActivitiesList";
export { default as ActivitiesPanelList } from "./components/ActivitiesPanelList";
export { default as ActivityDetailsLink } from "./components/ActivityDetailsLink";
export {
  ACTIVITY_SEARCH_HELP_TERMS,
  ACTIVITY_STATUS_OPTIONS,
} from "./components/ActivitiesHeader/constants";
export { default as ActivityTypeFilter } from "./components/ActivityTypeFilter";
export { ACTIVITY_STATUSES, EXCLUDED_ACTIVITY_TYPE_OPTIONS } from "./constants";
export { useOpenActivityDetailsPanel } from "./hooks";
export type {
  Activity,
  ActivityCommon,
  ActivityGroup,
  GetActivitiesParams,
  ActivityStatus,
} from "./types";
