import usePageParams from "@/hooks/usePageParams";
import { useGetScriptProfile } from "./useGetScriptProfile";
import type { ScriptProfile } from "../types";

export const useGetPageScriptProfile = ():
  | { scriptProfile: ScriptProfile; isGettingScriptProfile: false }
  | { scriptProfile: undefined; isGettingScriptProfile: true } => {
  const { name: scriptProfileId } = usePageParams();

  const { isGettingScriptProfile, scriptProfile, scriptProfileError } =
    useGetScriptProfile(
      { id: parseInt(scriptProfileId) },
      { enabled: !!scriptProfileId },
    );

  if (scriptProfileError) {
    throw scriptProfileError;
  }

  if (isGettingScriptProfile) {
    return { scriptProfile: undefined, isGettingScriptProfile: true };
  }

  return {
    scriptProfile: scriptProfile as ScriptProfile,
    isGettingScriptProfile: false,
  };
};
