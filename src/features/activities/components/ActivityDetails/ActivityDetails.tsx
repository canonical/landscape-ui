import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import SidePanel from "@/components/layout/SidePanel";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetInstance } from "@/features/instances";
import { CodeSnippet, Icon, Tabs } from "@canonical/react-components";
import date from "@/libs/date";
import { useState, type FC } from "react";
import { ACTIVITY_STATUSES } from "../../constants";
import { useGetSingleActivity } from "../../api";
import classes from "./ActivityDetails.module.scss";
import ActivityDetailsButtons from "./components/ActivityDetailsButtons";
import { ROUTES } from "@/libs/routes/routes";
import ActivityChildren from "../ActivityChildren";
import type { ActivityCommon } from "../../types";

interface ActivityDetailsProps {
  readonly activityId: number;
  readonly hideInstanceField?: boolean;
  readonly onClose?: () => void;
}

const ActivityDetails: FC<ActivityDetailsProps> = ({
  activityId,
  hideInstanceField,
  onClose,
}) => {
  const { activity, isGettingActivity, activityError } = useGetSingleActivity({
    activityId,
  });

  const instanceId = activity?.computer_id;

  const instanceQueryEnabled = instanceId !== undefined && !hideInstanceField;

  const { instance, isGettingInstance } = useGetInstance(
    { instanceId: instanceId as number },
    { enabled: instanceQueryEnabled },
  );

  const [tabId, setTabId] = useState("info");
  const [selectedChild, setSelectedChild] = useState<ActivityCommon>();

  if (isGettingActivity) {
    return <LoadingState />;
  }

  if (activityError) {
    throw activityError;
  }

  if (!activity) {
    throw new Error();
  }

  if (instanceQueryEnabled && isGettingInstance) {
    return <LoadingState />;
  }

  return (
    <>
      <ActivityDetailsButtons activity={activity} onClose={onClose} />

      {!!activity.children?.length && (
        <Tabs
          links={[
            {
              label: "Info",
              active: tabId === "info",
              role: "tab",
              onClick: (): void => {
                setTabId("info");
              },
            },
            {
              label: "Children",
              active: tabId === "children",
              role: "tab",
              onClick: (): void => {
                setTabId("children");
              },
            },
          ]}
        />
      )}

      {tabId === "info" && (
        <>
          <InfoGrid spaced>
            <InfoGrid.Item label="Description" large value={activity.summary} />

            {!hideInstanceField && instance && (
              <InfoGrid.Item
                label="Instance"
                large
                value={
                  <StaticLink
                    to={ROUTES.instances.details.fromInstance(instance)}
                  >
                    {instance.title}
                  </StaticLink>
                }
              />
            )}

            <InfoGrid.Item
              label="Status"
              value={
                <>
                  <Icon
                    name={ACTIVITY_STATUSES[activity.activity_status].icon}
                    className={classes.statusIcon}
                  />
                  <span>
                    {ACTIVITY_STATUSES[activity.activity_status].label}
                  </span>
                </>
              }
            />
            <InfoGrid.Item
              label="Created at"
              value={date(activity.creation_time).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
            />

            {typeof activity.delivery_time === "string" && (
              <InfoGrid.Item
                label="Delivered at"
                value={date(activity.delivery_time).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              />
            )}
            {activity.completion_time !== null && (
              <InfoGrid.Item
                label="Completed at"
                value={date(activity.completion_time).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              />
            )}

            <InfoGrid.Item
              label="Creator"
              large
              value={activity.creator?.name}
            />
          </InfoGrid>

          {activity.result_text && (
            <CodeSnippet
              className={classes.output}
              blocks={[
                {
                  wrapLines: true,
                  title: "Output",
                  code: activity.result_text,
                },
              ]}
            />
          )}
        </>
      )}

      {tabId === "children" && (
        <ActivityChildren
          activityId={activity.id}
          onActivityDetailsOpen={setSelectedChild}
        />
      )}
      {selectedChild && (
        <SidePanel
          isOpen
          onClose={() => {
            setSelectedChild(undefined);
          }}
          size="medium"
        >
          <SidePanel.Header>{selectedChild.summary}</SidePanel.Header>
          <SidePanel.Content>
            <ActivityDetails
              key={selectedChild.id}
              activityId={selectedChild.id}
              onClose={() => {
                setSelectedChild(undefined);
              }}
            />
          </SidePanel.Content>
        </SidePanel>
      )}
    </>
  );
};

export default ActivityDetails;
