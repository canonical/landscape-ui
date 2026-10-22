import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { ActivityCommon } from "../types";
import { lazy, Suspense, useCallback } from "react";

const ActivityDetails = lazy(
  async () => import("../components/ActivityDetails"),
);

export interface OpenActivityDetailsPanelOptions {
  hideInstanceField?: boolean;
}

const useOpenActivityDetailsPanel = () => {
  const { setSidePanelContent } = useSidePanel();

  return useCallback(
    (activity: ActivityCommon, options?: OpenActivityDetailsPanelOptions) => {
      setSidePanelContent(
        activity.summary,
        <Suspense fallback={<LoadingState />}>
          <ActivityDetails
            key={activity.id}
            activityId={activity.id}
            hideInstanceField={options?.hideInstanceField}
          />
        </Suspense>,
        "medium",
      );
    },
    [setSidePanelContent],
  );
};

export default useOpenActivityDetailsPanel;
