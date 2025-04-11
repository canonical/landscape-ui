import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon, Notification } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import { useGetScriptProfileLimits, useGetScriptProfiles } from "../../api";
import ScriptProfilesList from "../ScriptProfilesList";
import classes from "./ScriptProfilesPanel.module.scss";

const SingleScript = lazy(
  async () => import("@/features/scripts/components/SingleScript"),
);

const ScriptProfileAddForm = lazy(async () => import("../ScriptProfileForm"));

interface ScriptProfilesPanelProps {
  readonly hasScripts?: boolean;
  readonly isGettingScripts?: boolean;
}

const ScriptProfilesPanel: FC<ScriptProfilesPanelProps> = ({
  hasScripts,
  isGettingScripts,
}) => {
  const { search, status } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

  const { scriptProfiles, scriptProfilesCount, isGettingScriptProfiles } =
    useGetScriptProfiles();

  const {
    scriptProfilesCount: activeScriptProfilesCount,
    isGettingScriptProfiles: isGettingActiveScriptProfiles,
  } = useGetScriptProfiles({
    archived: "active",
    names: undefined,
    search: undefined,
  });

  const { scriptProfileLimits, isGettingScriptProfileLimits } =
    useGetScriptProfileLimits();

  if (isGettingScriptProfiles) {
    return <LoadingState />;
  }

  const addProfile = () => {
    setSidePanelContent(
      "Add script profile",
      <Suspense fallback={<LoadingState />}>
        <ScriptProfileAddForm
          initialValues={{
            access_group: "global",
            all_computers: false,
            tags: [],
            time_limit: 300,
            title: "",
            username: "root",
          }}
          submitButtonText="Add profile"
        />
      </Suspense>,
    );
  };

  const addProfileButton = (
    <Button
      type="button"
      appearance="positive"
      onClick={addProfile}
      className="u-no-margin--bottom"
      hasIcon
    >
      <Icon name="plus" light />
      <span>Add profile</span>
    </Button>
  );

  if (scriptProfiles.length || search || status) {
    if (isGettingActiveScriptProfiles || isGettingScriptProfileLimits) {
      return <LoadingState />;
    }

    if (
      activeScriptProfilesCount == undefined ||
      scriptProfileLimits == undefined
    ) {
      throw new Error();
    }

    return (
      <>
        <HeaderWithSearch
          actions={
            <div className={classes.actions}>
              <StatusFilter
                options={[
                  { label: "All", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Archived", value: "archived" },
                ]}
              />

              {addProfileButton}
            </div>
          }
        />

        <TableFilterChips filtersToDisplay={["search", "status"]} />

        {activeScriptProfilesCount >= scriptProfileLimits.max_num_profiles && (
          <Notification
            inline
            title="Profile limit reached:"
            severity="caution"
          >
            You&apos;ve reached the limit of{" "}
            {scriptProfileLimits.max_num_profiles} active script profiles. To be
            able to add new profiles you must archive an active one.
          </Notification>
        )}

        <ScriptProfilesList profiles={scriptProfiles} />

        <TablePagination
          totalItems={scriptProfilesCount}
          currentItemCount={scriptProfiles.length}
        />
      </>
    );
  }

  if (isGettingScripts) {
    return <LoadingState />;
  }

  const learnMoreLink = (
    <a href="PLACEHOLDER" target="_blank" rel="nofollow noopener noreferrer">
      Learn more about script profiles
    </a>
  );

  const addScript = () => {
    setSidePanelContent(
      "Add script",
      <Suspense fallback={<LoadingState />}>
        <SingleScript action="add" />
      </Suspense>,
    );
  };

  if (!hasScripts) {
    return (
      <EmptyState
        title="You need at least one script to add a profile"
        body={
          <>
            <p>
              In order to create a script profile, you need to have added a
              script to your Landscape organization.
            </p>

            <Button
              type="button"
              appearance="positive"
              onClick={addScript}
              className="u-no-margin--bottom"
              hasIcon
            >
              <Icon name="plus" light />
              <span>Add script</span>
            </Button>

            {learnMoreLink}
          </>
        }
      />
    );
  }

  return (
    <EmptyState
      title="You don't have any script profiles yet"
      body={
        <>
          <p>
            Script profiles allow you to automate your script runs based on
            triggers. Triggers can be either a recurring schedule, on a set
            date, or before or after an event.
          </p>

          {addProfileButton}

          {learnMoreLink}
        </>
      }
    />
  );
};

export default ScriptProfilesPanel;
