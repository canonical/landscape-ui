import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT, INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import {
  Button,
  ContextualMenu,
  Icon,
  ModularTable,
} from "@canonical/react-components";
import moment from "moment";
import { type FC, lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { useEditScriptProfile } from "../../api";
import {
  getAssociatedInstancesLink,
  getStatusText,
  getTriggerText,
} from "../../helpers";
import { useOpenScriptProfileDetails } from "../../hooks";
import type { ScriptProfile } from "../../types";
import ScriptProfileArchiveModal from "../ScriptProfileArchiveModal";
import type { ScriptProfileFormSubmitValues } from "../ScriptProfileForm/ScriptProfileForm";
import classes from "./ScriptProfilesList.module.scss";
import { ROUTES } from "@/libs/routes";

const ScriptProfileDetails = lazy(
  async () => import("../ScriptProfileDetails"),
);

const ScriptProfileForm = lazy(async () => import("../ScriptProfileForm"));

interface ScriptProfilesListProps {
  readonly profiles: ScriptProfile[];
}

const ScriptProfilesList: FC<ScriptProfilesListProps> = ({ profiles }) => {
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const { editScriptProfile, isEditingScriptProfile } = useEditScriptProfile();

  const [modalProfile, setModalProfile] = useState<ScriptProfile | null>(null);

  const actions = (profile: ScriptProfile) => ({
    archive: () => {
      setModalProfile(profile);
    },

    edit: () => {
      const handleSubmit = async (values: ScriptProfileFormSubmitValues) => {
        editScriptProfile({
          id: profile.id,
          all_computers: values.all_computers,
          tags: values.tags,
          time_limit: values.time_limit,
          title: values.title,
          trigger: values.trigger,
          username: values.username,
        });
      };

      setSidePanelContent(
        `Edit ${profile.title}`,
        <Suspense fallback={<LoadingState />}>
          <ScriptProfileForm
            disabledFields={{
              script_id: true,
              trigger_type: true,
            }}
            initialValues={{
              ...profile,
              interval: "",
              ...profile.trigger,
              start_after:
                profile.trigger.trigger_type == "recurring"
                  ? moment(profile.trigger.start_after)
                      .utc()
                      .format(INPUT_DATE_TIME_FORMAT)
                  : "",
              timestamp:
                profile.trigger.trigger_type == "one_time"
                  ? moment(profile.trigger.timestamp)
                      .utc()
                      .format(INPUT_DATE_TIME_FORMAT)
                  : "",
            }}
            onSubmit={handleSubmit}
            onSuccess={(values) => {
              notify.success({
                title: `You have successfully saved changes for ${values.title}`,
                message: "The changes will be applied to this profile.",
              });
            }}
            submitButtonText="Save changes"
            submitting={isEditingScriptProfile}
          />
        </Suspense>,
      );
    },

    viewDetails: () => {
      setSidePanelContent(
        profile.title,
        <Suspense fallback={<LoadingState />}>
          <ScriptProfileDetails actions={actions(profile)} profile={profile} />
        </Suspense>,
      );
    },
  });

  useOpenScriptProfileDetails((profile) => {
    actions(profile).viewDetails();
  });

  const columns = useMemo<Column<ScriptProfile>[]>(
    () => [
      {
        Header: "Name",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin u-no-padding--top u-align-text--left"
            onClick={actions(profile).viewDetails}
          >
            {profile.title}
          </Button>
        ),
      },

      {
        Header: "Status",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          getStatusText(profile),
        getCellIcon: ({
          row: {
            original: { archived },
          },
        }: CellProps<ScriptProfile>) =>
          archived ? "status-queued-small" : "status-succeeded-small",
      },

      {
        Header: "Associated instances",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          getAssociatedInstancesLink(profile),
      },

      {
        Header: "Tags",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          profile.all_computers
            ? "All instances"
            : profile.tags.join(", ") || <NoData />,
      },

      {
        Header: "Trigger",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          getTriggerText(profile),
      },

      {
        Header: "Last run",
        Cell: ({
          row: {
            original: {
              activities: { last_activity: activity },
            },
          },
        }: CellProps<ScriptProfile>) =>
          activity ? (
            <Link
              className={classes.link}
              to={ROUTES.activities({ query: `parent-id%3A${activity.id}` })}
            >
              {moment(activity.creation_time)
                .utc()
                .format(DISPLAY_DATE_TIME_FORMAT)}{" "}
            </Link>
          ) : (
            <NoData />
          ),
      },

      {
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) => {
          const links: MenuLink[] = [
            {
              children: (
                <>
                  <Icon name="switcher-environments" />
                  <span>View details</span>
                </>
              ),
              hasIcon: true,
              onClick: actions(profile).viewDetails,
            },
          ];

          if (!profile.archived) {
            links.push(
              {
                children: (
                  <>
                    <Icon name="edit" />
                    <span>Edit</span>
                  </>
                ),
                hasIcon: true,
                onClick: actions(profile).edit,
              },
              {
                children: (
                  <>
                    <Icon name="archive--negative" />
                    <span className="u-text--negative">Archive</span>
                  </>
                ),
                hasIcon: true,
                onClick: actions(profile).archive,
                className: classes.archive,
              },
            );
          }

          return (
            <ContextualMenu
              className={classes.menu}
              toggleAppearance="base"
              toggleClassName={classes.toggleButton}
              toggleLabel={<Icon name="contextual-menu" />}
              links={links}
            />
          );
        },
      },
    ],
    [],
  );

  const removeModalProfile = () => {
    setModalProfile(null);
  };

  return (
    <>
      <ModularTable
        columns={columns}
        data={profiles}
        emptyMsg="No script profiles found according to your search parameters."
      />
      {modalProfile && (
        <ScriptProfileArchiveModal
          profile={modalProfile}
          removeProfile={removeModalProfile}
        />
      )}
    </>
  );
};

export default ScriptProfilesList;
