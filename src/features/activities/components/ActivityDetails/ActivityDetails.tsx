import Blocks from "@/components/layout/Blocks";
import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import SidePanel from "@/components/layout/SidePanel";
import { useGetInstance } from "@/features/instances";
import { CodeSnippet, Tabs } from "@canonical/react-components";
import { useState, type FC } from "react";
import { useGetSingleActivity } from "../../api";
import classes from "./ActivityDetails.module.scss";
import ActivityDetailsButtons from "./components/ActivityDetailsButtons";
import { ROUTES } from "@/libs/routes/routes";
import ActivityChildren from "../ActivityChildren";
import type { ActivityCommon } from "../../types";
import ActivityDetailsInfo from "./components/ActivityDetailsInfo";

interface ActivityDetailsProps {
  readonly activityId: number;
  readonly hideInstanceField?: boolean;
  readonly onClose?: () => void;
  readonly size?: "small" | "medium" | "large";
}

const ActivityDetails: FC<ActivityDetailsProps> = ({
  activityId,
  hideInstanceField,
  onClose,
  size = "small",
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

  const isActivityGroup = activity.type === "ActivityGroup";
  const output = activity.result_text ? (
    <CodeSnippet blocks={[{ wrapLines: true, code: activity.result_text }]} />
  ) : null;

  return (
    <>
      <div className={classes.actions}>
        <ActivityDetailsButtons activity={activity} onClose={onClose} />
      </div>

      <Blocks>
        <Blocks.Item>
          <ActivityDetailsInfo
            activity={activity}
            instanceLink={
              !hideInstanceField &&
              instance && (
                <StaticLink
                  to={ROUTES.instances.details.fromInstance(instance)}
                >
                  {instance.title}
                </StaticLink>
              )
            }
          />
        </Blocks.Item>
        {!isActivityGroup && output && (
          <Blocks.Item title="Output">{output}</Blocks.Item>
        )}
        {isActivityGroup && !output && (
          <Blocks.Item title="Activities">
            <ActivityChildren
              activityId={activity.id}
              onActivityDetailsOpen={setSelectedChild}
            />
          </Blocks.Item>
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

          <div hidden={tabId !== "activities"}>
            <ActivityChildren
              activityId={activity.id}
              onActivityDetailsOpen={setSelectedChild}
            />
          </div>
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
};

export default ActivityDetails;
