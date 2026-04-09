import { useGetScripts } from "@/features/scripts";
import { lazy, useEffect, type FC } from "react";
import { useGetScriptProfileLimits, useGetScriptProfiles } from "../../api";
import NoScriptsEmptyState from "../NoScriptsEmptyState";
import { ProfilesContainer, ProfileTypes } from "@/features/profiles";
import { ProfilesProvider } from "@/context/profiles";
import useProfiles from "@/hooks/useProfiles";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";

const ScriptProfileAddSidePanel = lazy(
  () => import("../ScriptProfileAddSidePanel"),
);

const ScriptProfileEditSidePanel = lazy(
  () => import("../ScriptProfileEditSidePanel"),
);

const ScriptProfilesTab: FC = () => {
  const { sidePath, lastSidePathSegment, createPageParamsSetter } =
    usePageParams();

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

  const { setIsProfileLimitReached } = useProfiles();

  useSetDynamicFilterValidation("sidePath", ["add", "edit"]);

  const isScriptProfileLimitReached =
    !!scriptProfileLimits &&
    !!activeScriptProfilesCount &&
    activeScriptProfilesCount >= scriptProfileLimits.max_num_profiles;

  useEffect(() => {
    setIsProfileLimitReached(isScriptProfileLimitReached);
  }, [setIsProfileLimitReached, isScriptProfileLimitReached]);

  if (!isGettingActiveScripts && !activeScriptsCount) {
    return <NoScriptsEmptyState />;
  }

  return (
    <ProfilesProvider>
      <ProfilesContainer
        type={ProfileTypes.script}
        profiles={scriptProfiles}
        profilesCount={scriptProfilesCount}
        isPending={
          isGettingActiveScripts ||
          isGettingScriptProfiles ||
          isGettingActiveScriptProfiles ||
          isGettingScriptProfileLimits
        }
      />

      <SidePanel
        onClose={createPageParamsSetter({ sidePath: [], profile: "" })}
        isOpen={!!sidePath.length}
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <ScriptProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && (
          <SidePanel.Suspense key="edit">
            <ScriptProfileEditSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </ProfilesProvider>
  );
};

export default ScriptProfilesTab;
