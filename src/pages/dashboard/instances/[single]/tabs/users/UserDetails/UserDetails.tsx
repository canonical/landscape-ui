import InfoGrid from "@/components/layout/InfoGrid";
import useUsers from "@/hooks/useUsers";
import type { UrlParams } from "@/types/UrlParams";
import type { User } from "@/types/User";
import type { FC } from "react";
import { useParams } from "react-router";
import UserPanelActionButtons from "../UserPanelActionButtons";

interface UserDetailsProps {
  readonly user: User;
}

const UserDetails: FC<UserDetailsProps> = ({ user }) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const { getGroupsQuery, getUserGroupsQuery } = useUsers();

  const instanceId = Number(urlInstanceId);

  const { data: allGroupsData } = getGroupsQuery({ computer_id: instanceId });
  const { data: userGroupsData } = getUserGroupsQuery({
    username: user.username,
    computer_id: instanceId,
  });

  const groupsData = allGroupsData?.data.groups ?? [];
  const primaryGroup = groupsData?.find(
    (group) => group.gid === user.primary_gid,
  )?.name;
  const userGroups = userGroupsData?.data.groups
    .map((group) => group.name)
    .join(", ");

  return (
    <>
      <UserPanelActionButtons selectedUsers={[user]} sidePanel />
      <InfoGrid spaced>
        <InfoGrid.Item label="Username" large value={user.username} />

        <InfoGrid.Item label="Name" large value={user.name || null} />

        <InfoGrid.Item label="Passphrase" large type="password" />

        <InfoGrid.Item label="Primary group" large value={primaryGroup} />

        <InfoGrid.Item
          label="Additional groups"
          large
          value={userGroups}
          type="truncated"
        />

        <InfoGrid.Item label="Location" large value={user?.location} />

        <InfoGrid.Item label="Home phone" large value={user?.home_phone} />

        <InfoGrid.Item label="Work phone" large value={user?.work_phone} />
      </InfoGrid>
    </>
  );
};

export default UserDetails;
