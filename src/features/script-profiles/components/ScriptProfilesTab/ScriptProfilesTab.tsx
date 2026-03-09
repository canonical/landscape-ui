import { useGetScripts } from "@/features/scripts";
import { type FC } from "react";
import { useGetScriptProfileLimits, useGetScriptProfiles } from "../../api";
import NoScriptsEmptyState from "../NoScriptsEmptyState";
import { ProfilesContainer } from "@/features/profiles";

const ScriptProfilesTab: FC = () => {
  const {
    scriptsCount: activeScriptsCount,
    isScriptsLoading: isGettingActiveScripts,
  } = useGetScripts(
    { listenToUrlParams: false },
    {
      script_type: "active",
      limit: 0,
      offset: 0,
    },
  );

  const { scriptProfiles, scriptProfilesCount, isGettingScriptProfiles } =
    useGetScriptProfiles();

  const {
    scriptProfilesCount: activeScriptProfilesCount,
    isGettingScriptProfiles: isGettingActiveScriptProfiles,
  } = useGetScriptProfiles(
    { listenToUrlParams: false },
    { archived: "active" },
  );

  const { scriptProfileLimits, isGettingScriptProfileLimits } =
    useGetScriptProfileLimits();

  if (!isGettingActiveScripts && !activeScriptsCount) {
    return <NoScriptsEmptyState />;
  }

  const isScriptProfileLimitReached = !!scriptProfileLimits && !!activeScriptProfilesCount
    && activeScriptProfilesCount >= scriptProfileLimits.max_num_profiles;

  return (
    <ProfilesContainer
      type="script"
      profiles={scriptProfiles}
      profilesCount={scriptProfilesCount}
      isPending={
        isGettingActiveScripts ||
        isGettingScriptProfiles ||
        isGettingActiveScriptProfiles ||
        isGettingScriptProfileLimits
      }
      isProfileLimitReached={isScriptProfileLimitReached}
    />
  );
};

export default ScriptProfilesTab;
