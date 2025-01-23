import { useEffect } from "react";
import { Activity, ActivityCommon } from "../types";
import { useLocation } from "react-router";

export default function useOpenActivityDetails(
  handleActivityDetailsOpen: (activity: ActivityCommon) => void,
) {
  const { state }: { state: { activity?: Activity } } = useLocation();
  const activity = state?.activity;

  useEffect(() => {
    if (!state?.activity) {
      return;
    }

    handleActivityDetailsOpen(state.activity);
    window.history.replaceState({}, "");
  }, [activity]);
}
