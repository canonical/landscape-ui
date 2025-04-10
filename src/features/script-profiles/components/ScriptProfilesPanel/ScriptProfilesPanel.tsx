import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import { useGetScriptProfiles } from "../../api/useGetScriptProfiles";
import ScriptProfilesList from "../ScriptProfilesList";
import classes from "./ScriptProfilesPanel.module.scss";
const SingleScript = lazy(
  async () => import("../../../scripts/components/SingleScript"),
);
const ScriptProfileAddForm = lazy(
  async () => import("../ScriptProfileAddForm"),
);

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

  const { scriptProfiles, isGettingScriptProfiles } = useGetScriptProfiles();

  if (isGettingScriptProfiles) {
    return <LoadingState />;
  }

  const addProfile = () => {
    setSidePanelContent(
      "Add script profile",
      <Suspense fallback={<LoadingState />}>
        <ScriptProfileAddForm />
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

        <ScriptProfilesList profiles={scriptProfiles} />
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
