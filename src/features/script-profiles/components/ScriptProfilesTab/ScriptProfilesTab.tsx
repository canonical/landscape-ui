import { useGetScripts } from "@/features/scripts";
import { lazy, useEffect, type FC } from "react";
import {
  useArchiveScriptProfile,
  useGetPageScriptProfile,
  useGetScriptProfileLimits,
  useGetScriptProfiles,
} from "../../api";
import NoScriptsEmptyState from "../NoScriptsEmptyState";
import {
  ProfilesContainer,
  ProfileTypes,
  ViewProfileSidePanel,
} from "@/features/profiles";
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

  const {
    setIsProfileLimitReached,
    setProfileLimit,
    setRemoveProfile,
    setIsRemovingProfile,
  } = useProfiles();

  const { scriptProfile } = useGetPageScriptProfile();

  const { archiveScriptProfile, isArchivingScriptProfile } =
    useArchiveScriptProfile();

  useEffect(() => {
    setRemoveProfile(({ id }) => archiveScriptProfile({ id }));
    setIsRemovingProfile(isArchivingScriptProfile);
  }, [
    setRemoveProfile,
    setIsRemovingProfile,
    archiveScriptProfile,
    isArchivingScriptProfile,
  ]);

  useSetDynamicFilterValidation("sidePath", ["add", "edit", "view"]);

  const isScriptProfileLimitReached =
    !!scriptProfileLimits &&
    !!activeScriptProfilesCount &&
    activeScriptProfilesCount >= scriptProfileLimits.max_num_profiles;

  useEffect(() => {
    setIsProfileLimitReached(isScriptProfileLimitReached);
    setProfileLimit(scriptProfileLimits?.max_num_profiles ?? 0);
  }, [
    setIsProfileLimitReached,
    isScriptProfileLimitReached,
    scriptProfileLimits?.max_num_profiles,
    setProfileLimit,
  ]);

  if (!isGettingActiveScripts && !activeScriptsCount) {
    return <NoScriptsEmptyState />;
  }

  return (
    <>
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
        onClose={createPageParamsSetter({ sidePath: [], name: "" })}
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

        {lastSidePathSegment === "view" && (
          <SidePanel.Suspense key="view">
            <ViewProfileSidePanel
              type={ProfileTypes.script}
              profile={scriptProfile}
            />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default ScriptProfilesTab;
