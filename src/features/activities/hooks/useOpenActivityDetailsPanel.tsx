import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { ActivityCommon } from "../types";
import { lazy, Suspense, useCallback } from "react";

const ActivityDetails = lazy(
  async () => import("../components/ActivityDetails"),
);

export interface OpenActivityDetailsPanelOptions {
  hideInstanceField?: boolean;
  size?: "small" | "medium" | "large";
}

const useOpenActivityDetailsPanel = () => {
  const { setSidePanelContent } = useSidePanel();

  return useCallback(
    (
      activity: Pick<ActivityCommon, "id" | "summary">,
      options?: OpenActivityDetailsPanelOptions,
    ) => {
      setSidePanelContent(
        activity.summary,
        <Suspense fallback={<LoadingState />}>
          <ActivityDetails
            key={activity.id}
            activityId={activity.id}
            hideInstanceField={options?.hideInstanceField}
            size={options?.size}
          />
        </Suspense>,
        options?.size ?? "small",
      );
    },
    [setSidePanelContent],
  );
};

export default useOpenActivityDetailsPanel;
