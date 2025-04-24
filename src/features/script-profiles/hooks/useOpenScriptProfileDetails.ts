import { useEffect } from "react";
import { useLocation } from "react-router";
import type { ScriptProfile } from "../types";
import { useGetScriptProfile } from "../api";

export default function useOpenScriptProfileDetails(
  handleScriptProfileDetailsOpen: (profile: ScriptProfile) => void,
) {
  const { state }: { state: { scriptProfileId?: number } } = useLocation();
  const profileId = state?.scriptProfileId || 0;

  const { scriptProfile } = useGetScriptProfile(
    {
      id: profileId,
    },
    {
      enabled: !!profileId,
    },
  );

  useEffect(() => {
    if (!profileId || !scriptProfile) {
      return;
    }

    handleScriptProfileDetailsOpen(scriptProfile);
    window.history.replaceState({}, "");
  }, [profileId, scriptProfile]);
}
