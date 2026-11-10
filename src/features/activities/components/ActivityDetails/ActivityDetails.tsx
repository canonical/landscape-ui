import Blocks from "@/components/layout/Blocks";
import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import StaticLink from "@/components/layout/StaticLink";
import { useGetInstance } from "@/features/instances";
import { ROUTES } from "@/libs/routes/routes";
import { CodeSnippet, Icon, Tabs } from "@canonical/react-components";
import { useState } from "react";
import type { FC } from "react";
import { useGetSingleActivity } from "../../api";
import type { ActivityCommon } from "../../types";
import classes from "./ActivityDetails.module.scss";
import ActivityDetailsButtons from "./components/ActivityDetailsButtons";
import ActivitiesPanelList from "../ActivitiesPanelList";
import InfoGrid from "@/components/layout/InfoGrid";
import { ACTIVITY_STATUSES } from "../../constants";
import date from "@/libs/date";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";

interface ActivityDetailsProps {
  readonly activityId: number;
  readonly onClose: () => void;
  readonly hideInstanceField?: boolean;
  readonly size?: "small" | "medium" | "large";
  readonly renderInSidePanel?: boolean;
}

const ActivityDetails: FC<ActivityDetailsProps> = ({
  activityId,
  hideInstanceField,
  onClose,
  size = "small",
  renderInSidePanel,
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

  const [tabId, setTabId] = useState("activities");
  const [selectedChild, setSelectedChild] = useState<ActivityCommon>();

  if (isGettingActivity) {
    return renderInSidePanel ? <SidePanel.LoadingState /> : <LoadingState />;
  }

  if (activityError) {
    throw activityError;
  }

  if (!activity) {
    throw new Error();
  }

  if (instanceQueryEnabled && isGettingInstance) {
    return renderInSidePanel ? <SidePanel.LoadingState /> : <LoadingState />;
  }

  const isActivityGroup = activity.type === "ActivityGroup";

  const output = activity.result_text ? (
    <CodeSnippet blocks={[{ wrapLines: true, code: activity.result_text }]} />
  ) : null;

  const activityChildren = (
    <ActivitiesPanelList
      parentId={activity.id}
      size={size}
      availableActions={{
        approve: true,
        cancel: true,
        redo: true,
      }}
    />
  );

  const children = (
    <>
      <div className={classes.actions}>
        <ActivityDetailsButtons activity={activity} onClose={onClose} />
      </div>

      <Blocks>
        <Blocks.Item>
          <InfoGrid dense>
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
        </Blocks.Item>

        {!isActivityGroup && output && (
          <Blocks.Item title="Output">{output}</Blocks.Item>
        )}

        {isActivityGroup && !output && (
          <Blocks.Item title="Activities">{activityChildren}</Blocks.Item>
        )}
      </Blocks>

      {isActivityGroup && output && (
        <>
          <Tabs
            className={classes.tabs}
            links={[
              {
                label: "Activities",
                active: tabId === "activities",
                role: "tab",
                onClick: (): void => {
                  setTabId("activities");
                },
              },
              {
                label: "Output",
                active: tabId === "output",
                role: "tab",
                onClick: (): void => {
                  setTabId("output");
                },
              },
            ]}
          />

          {tabId === "activities" && activityChildren}
          {tabId === "output" && output}
        </>
      )}

      {selectedChild && (
        <SidePanel
          isOpen
          onClose={() => {
            setSelectedChild(undefined);
          }}
          size={size}
        >
          <SidePanel.Header>{selectedChild.summary}</SidePanel.Header>
          <SidePanel.Content>
            <ActivityDetails
              key={selectedChild.id}
              activityId={selectedChild.id}
              size={size}
              onClose={() => {
                setSelectedChild(undefined);
              }}
            />
          </SidePanel.Content>
        </SidePanel>
      )}
    </>
  );

  if (renderInSidePanel) {
    return (
      <>
        <SidePanel.Header>{activity.summary}</SidePanel.Header>
        <SidePanel.Content>{children}</SidePanel.Content>
      </>
    );
  } else {
    return children;
  }
};

export default ActivityDetails;
