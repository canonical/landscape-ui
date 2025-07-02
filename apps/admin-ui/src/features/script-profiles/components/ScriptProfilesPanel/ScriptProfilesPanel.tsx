import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import { useGetScripts } from "@/features/scripts";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon, Notification } from "@canonical/react-components";
import moment from "moment";
import { type FC, lazy, Suspense } from "react";
import {
  useAddScriptProfile,
  useGetScriptProfileLimits,
  useGetScriptProfiles,
} from "../../api";
import ScriptProfilesList from "../ScriptProfilesList";
import classes from "./ScriptProfilesPanel.module.scss";
import { STATUS_OPTIONS } from "./constants";

const CreateScriptForm = lazy(async () =>
  import("@/features/scripts").then((module) => ({
    default: module.CreateScriptForm,
  })),
);

const ScriptProfileForm = lazy(async () => import("../ScriptProfileForm"));

const ScriptProfilesPanel: FC = () => {
  const { notify } = useNotify();
  const { currentPage, pageSize, search, status } = usePageParams();
  const { setSidePanelContent } = useSidePanel();

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
  const { addScriptProfile, isAddingScriptProfile } = useAddScriptProfile();

  const {
    scriptProfilesCount: activeScriptProfilesCount,
    isGettingScriptProfiles: isGettingActiveScriptProfiles,
  } = useGetScriptProfiles(
    { listenToUrlParams: false },
    { archived: "active" },
  );

  const { scriptProfileLimits, isGettingScriptProfileLimits } =
    useGetScriptProfileLimits();

  const isProfilesLoading =
    currentPage === 1 && pageSize === 20 && isGettingScriptProfiles;

  if (
    isGettingActiveScriptProfiles ||
    isGettingScriptProfileLimits ||
    scriptProfileLimits === null
  ) {
    return <LoadingState />;
  }

  const addProfile = () => {
    setSidePanelContent(
      "Add script profile",
      <Suspense fallback={<LoadingState />}>
        <ScriptProfileForm
          initialValues={{
            all_computers: false,
            interval: "",
            start_after: moment().utc().format(INPUT_DATE_TIME_FORMAT),
            tags: [],
            time_limit: 300,
            timestamp: moment().utc().format(INPUT_DATE_TIME_FORMAT),
            title: "",
            trigger_type: "",
            username: "root",
            script: null,
          }}
          onSubmit={async (values) => {
            await addScriptProfile({
              all_computers: values.all_computers,
              script_id: values.script_id,
              tags: values.tags,
              time_limit: values.time_limit,
              title: values.title,
              trigger: values.trigger,
              username: values.username,
            });
          }}
          onSuccess={(values) => {
            notify.success({
              title: `You have successfully created ${values.title}`,
              message:
                "The profile has been created and associated to the defined instances.",
            });
          }}
          submitButtonText="Add profile"
          submitting={isAddingScriptProfile}
        />
      </Suspense>,
    );
  };

  if (isGettingActiveScriptProfiles || isGettingScriptProfileLimits) {
    return <LoadingState />;
  }

  if (scriptProfileLimits == null) {
    return;
  }

  const addProfileButton = (
    <Button
      type="button"
      appearance="positive"
      onClick={addProfile}
      className="u-no-margin--bottom"
      hasIcon
      disabled={
        activeScriptProfilesCount >= scriptProfileLimits.max_num_profiles
      }
    >
      <Icon name="plus" light />
      <span>Add profile</span>
    </Button>
  );

  if (scriptProfiles.length || search || status || isProfilesLoading) {
    return (
      <>
        <HeaderWithSearch
          actions={
            <div className={classes.actions}>
              <StatusFilter label="Status" options={STATUS_OPTIONS} />
              {addProfileButton}
            </div>
          }
        />

        <TableFilterChips
          filtersToDisplay={["search", "status"]}
          statusOptions={STATUS_OPTIONS}
        />

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

        {isProfilesLoading ? (
          <LoadingState />
        ) : (
          <>
            <ScriptProfilesList profiles={scriptProfiles} />
            <TablePagination
              totalItems={scriptProfilesCount}
              currentItemCount={scriptProfiles.length}
            />
          </>
        )}
      </>
    );
  }

  if (isActiveScriptsLoading) {
    return <LoadingState />;
  }

  const addScript = () => {
    setSidePanelContent(
      "Add script",
      <Suspense fallback={<LoadingState />}>
        <CreateScriptForm />
      </Suspense>,
    );
  };

  if (!activeScriptsCount) {
    return (
      <EmptyState
        title="You need at least one script to add a profile."
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
          </>
        }
      />
    );
  }

  return (
    <EmptyState
      title="You don't have any script profiles yet."
      body={
        <>
          <p>
            Script profiles allow you to automate your script runs based on
            triggers. Triggers can be either a recurring schedule, on a set
            date, or before or after an event.
          </p>

          {addProfileButton}
        </>
      }
    />
  );
};

export default ScriptProfilesPanel;
