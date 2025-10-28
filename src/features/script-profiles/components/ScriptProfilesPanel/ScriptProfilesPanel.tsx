import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { useGetScripts } from "@/features/scripts";
import usePageParams from "@/hooks/usePageParams";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { Notification } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useGetScriptProfileLimits, useGetScriptProfiles } from "../../api";
import NoScriptProfilesEmptyState from "../NoScriptProfilesEmptyState";
import NoScriptsEmptyState from "../NoScriptsEmptyState";
import ScriptProfilesHeader from "../ScriptProfilesHeader";
import ScriptProfilesList from "../ScriptProfilesList";

const ScriptProfilesPanel: FC = () => {
  const { currentPage, pageSize, search, status } = usePageParams();

  const {
    scriptsCount: activeScriptsCount,
    isScriptsLoading: isActiveScriptsLoading,
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

  const { value: isNotificationVisible, setFalse: hideNotification } =
    useBoolean(true);

  const isProfilesLoading =
    currentPage === 1 &&
    pageSize === DEFAULT_PAGE_SIZE &&
    isGettingScriptProfiles;

  if (
    isGettingActiveScriptProfiles ||
    isGettingScriptProfileLimits ||
    scriptProfileLimits === null
  ) {
    return <LoadingState />;
  }

  if (scriptProfiles.length || search || status || isProfilesLoading) {
    return (
      <>
        <ScriptProfilesHeader />

        {isNotificationVisible &&
          activeScriptProfilesCount &&
          activeScriptProfilesCount >= scriptProfileLimits.max_num_profiles && (
            <Notification
              inline
              title="Profile limit reached:"
              severity="caution"
              onDismiss={hideNotification}
            >
              You&apos;ve reached the limit of{" "}
              {scriptProfileLimits.max_num_profiles} active script profiles. To
              be able to add new profiles you must archive an active one.
            </Notification>
          )}

        {isGettingScriptProfiles ? (
          <LoadingState />
        ) : (
          <ScriptProfilesList profiles={scriptProfiles} />
        )}
        <TablePagination
          totalItems={scriptProfilesCount}
          currentItemCount={scriptProfiles.length}
        />
      </>
    );
  }

  if (isActiveScriptsLoading) {
    return <LoadingState />;
  }

  if (!activeScriptsCount) {
    return <NoScriptsEmptyState />;
  }

  return <NoScriptProfilesEmptyState />;
};

export default ScriptProfilesPanel;
