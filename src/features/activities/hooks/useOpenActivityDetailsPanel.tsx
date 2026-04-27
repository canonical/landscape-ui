import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { ActivityCommon } from "../types";
import { lazy, Suspense, useCallback } from "react";

const ActivityDetails = lazy(
  async () => import("../components/ActivityDetails"),
);

const useOpenActivityDetailsPanel = () => {
  const { setSidePanelContent } = useSidePanel();

  return useCallback(
    (activity: ActivityCommon) => {
      setSidePanelContent(
        activity.summary,
        <Suspense fallback={<LoadingState />}>
          <ActivityDetails activityId={activity.id} />
        </Suspense>,
      );
    },
    [setSidePanelContent],
  );
};

export default useOpenActivityDetailsPanel;
