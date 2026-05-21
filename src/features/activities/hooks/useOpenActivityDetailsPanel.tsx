import usePageParams from "@/hooks/usePageParams";
import type { ActivityCommon } from "../types";
import { useCallback } from "react";

const useOpenActivityDetailsPanel = () => {
  const { setPageParams, sidePath } = usePageParams();

  return useCallback(
    (activity: ActivityCommon) => {
      setPageParams({
        sidePath: [...sidePath, "view"],
        name: String(activity.id),
      });
    },
    [setPageParams, sidePath],
  );
};

export default useOpenActivityDetailsPanel;
