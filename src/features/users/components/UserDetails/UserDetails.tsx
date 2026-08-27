import InfoGrid from "@/components/layout/InfoGrid";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import type { UrlParams } from "@/types/UrlParams";
import type { User } from "@/types/User";
import { Notification } from "@canonical/react-components";
import type { FC } from "react";
import { Link, useParams } from "react-router";
import { getPendingUserActivityMessage } from "../../constants";
import UserPanelActionButtons from "../UserPanelActionButtons";
import { useGetGroups, useGetUserGroups } from "../../api";

interface UserDetailsProps {
  readonly user: User;
}

const UserDetails: FC<UserDetailsProps> = ({ user }) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const instanceId = Number(urlInstanceId);
  const { closeSidePanel } = useSidePanel();

  const { groups: allGroups } = useGetGroups({ computer_id: instanceId });
  const { userGroups: userGroupsData } = useGetUserGroups({
    username: user.username,
    computer_id: instanceId,
  });

  const primaryGroup = allGroups?.find(
    (group) => group.gid === user.primary_gid,
  )?.name;
  const userGroups = userGroupsData?.map((group) => group.name).join(", ");

  return (
    <>
      {user.pending_activity?.operation === "delete" && (
        <Notification inline severity="caution" title="User activity pending:">
          <span>
            {getPendingUserActivityMessage(
              user.pending_activity.operation,
            )}{" "}
          </span>
          <Link
            to={ROUTES.activities.root({
              query: `id:${user.pending_activity.activity_id}`,
            })}
            state={{
              activity: {
                id: user.pending_activity.activity_id,
                summary: user.pending_activity.summary,
              },
            }}
            onClick={closeSidePanel}
          >
            View activity
          </Link>
        </Notification>
      )}

      <UserPanelActionButtons selectedUsers={[user]} sidePanel />

      <InfoGrid spaced>
        <InfoGrid.Item label="Username" large value={user.username} />

        <InfoGrid.Item label="Name" large value={user.name} />

        <InfoGrid.Item label="Password" large type="password" />

        <InfoGrid.Item label="Primary group" large value={primaryGroup} />

        <InfoGrid.Item
          label="Additional groups"
          large
          value={userGroups}
          type="truncated"
        />

        <InfoGrid.Item label="Location" large value={user.location} />

        <InfoGrid.Item label="Home phone" large value={user.home_phone} />

        <InfoGrid.Item label="Work phone" large value={user.work_phone} />
      </InfoGrid>
    </>
  );
};

export default UserDetails;
