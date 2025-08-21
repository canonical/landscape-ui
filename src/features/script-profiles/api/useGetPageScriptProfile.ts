import usePageParams from "@/hooks/usePageParams";
import { useGetScriptProfile } from ".";
import type { ScriptProfile } from "../types";

const useGetPageScriptProfile = ():
  | { scriptProfile: ScriptProfile; isGettingScriptProfile: false }
  | { scriptProfile: undefined; isGettingScriptProfile: true } => {
  const { profile: scriptProfileId } = usePageParams();

  const { isGettingScriptProfile, scriptProfile, scriptProfileError } =
    useGetScriptProfile({ id: parseInt(scriptProfileId) });

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

export default useGetPageScriptProfile;
