import type { ListAction } from "@/components/layout/ListActions";
import ListActions, {
  LIST_ACTIONS_COLUMN_PROPS,
} from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT, INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { useEditScriptProfile } from "../../api";
import { getStatusText, getTriggerText } from "../../helpers";
import { useOpenScriptProfileDetails } from "../../hooks";
import type { ScriptProfile } from "../../types";
import ScriptProfileArchiveModal from "../ScriptProfileArchiveModal";
import ScriptProfileAssociatedInstancesLink from "../ScriptProfileAssociatedInstancesLink";
import type { ScriptProfileFormSubmitValues } from "../ScriptProfileForm/ScriptProfileForm";
import classes from "./ScriptProfilesList.module.scss";
import { getCellProps, getRowProps } from "./helpers";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import TruncatedCell from "@/components/layout/TruncatedCell";

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
  const { expandedRowIndex, handleExpand, getTableRowsRef } =
    useExpandableRow();

  const { editScriptProfile, isEditingScriptProfile } = useEditScriptProfile();

  const [modalProfile, setModalProfile] = useState<ScriptProfile | null>(null);

  const actions = (profile: ScriptProfile) => ({
    archive: () => {
      setModalProfile(profile);
    },

    edit: () => {
      const handleSubmit = async (values: ScriptProfileFormSubmitValues) => {
        await editScriptProfile({
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
        accessor: "title",
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
        accessor: "archived",
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
        accessor: "all_computers",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) => (
          <ScriptProfileAssociatedInstancesLink scriptProfile={profile} />
        ),
      },

      {
        Header: "Tags",
        accessor: "tags",
        Cell: ({
          row: { original: profile, index },
        }: CellProps<ScriptProfile>) => {
          if (profile.all_computers) {
            return "All instances";
          }

          if (profile.tags.length === 0) {
            return <NoData />;
          }

          return (
            <TruncatedCell
              content={profile.tags.map((tag) => (
                <span className="truncatedItem" key={tag}>
                  {tag}
                </span>
              ))}
              isExpanded={index == expandedRowIndex}
              onExpand={() => {
                handleExpand(index);
              }}
              showCount
            />
          );
        },
      },

      {
        Header: "Trigger",
        accessor: "trigger",
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) =>
          getTriggerText(profile),
      },

      {
        Header: "Last run",
        accessor: "activities.last_activity.creation_time",
        className: "date-cell",
        Cell: ({
          row: {
            original: {
              activities: { last_activity: activity },
            },
          },
        }: CellProps<ScriptProfile>) =>
          activity ? (
            <Link
              className={`${classes.link} font-monospace`}
              to={`/activities?query=parent-id%3A${activity.id}`}
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
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original: profile } }: CellProps<ScriptProfile>) => {
          const nondestructiveActions: ListAction[] = [
            {
              icon: "switcher-environments",
              label: "View details",
              onClick: actions(profile).viewDetails,
            },
          ];

          if (!profile.archived) {
            nondestructiveActions.push({
              icon: "edit",
              label: "Edit",
              onClick: actions(profile).edit,
            });
          }

          const destructiveActions: ListAction[] | undefined = !profile.archived
            ? [
                {
                  icon: "archive",
                  label: "Archive",
                  onClick: actions(profile).archive,
                },
              ]
            : undefined;

          return (
            <ListActions
              toggleAriaLabel={`${profile.title} script profile actions`}
              actions={nondestructiveActions}
              destructiveActions={destructiveActions}
            />
          );
        },
      },
    ],
    [expandedRowIndex],
  );

  const removeModalProfile = () => {
    setModalProfile(null);
  };

  return (
    <div ref={getTableRowsRef}>
      <ResponsiveTable
        columns={columns}
        data={profiles}
        emptyMsg="No script profiles found according to your search parameters."
        getCellProps={getCellProps(expandedRowIndex)}
        getRowProps={getRowProps(expandedRowIndex)}
        minWidth={1200}
      />
      {modalProfile && (
        <ScriptProfileArchiveModal
          profile={modalProfile}
          removeProfile={removeModalProfile}
        />
      )}
    </div>
  );
};

export default ScriptProfilesList;
