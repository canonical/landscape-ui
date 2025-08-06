import InfoGrid from "@/components/layout/InfoGrid";
import useUsers from "@/hooks/useUsers";
import type { UrlParams } from "@/types/UrlParams";
import type { User } from "@/types/User";
import type { FC } from "react";
import { useParams } from "react-router";
import UserPanelActionButtons from "../UserPanelActionButtons";
import classes from "./UserDetails.module.scss";

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
      <InfoGrid className={classes.infoGrid}>
        <InfoGrid.Item label="Username" size={12} value={user.username} />

        <InfoGrid.Item label="Name" size={12} value={user.name || null} />

        <InfoGrid.Item label="Passphrase" size={12} type="password" />

        <InfoGrid.Item label="Primary group" size={12} value={primaryGroup} />

        <InfoGrid.Item
          label="Additional groups"
          size={12}
          value={userGroups}
          type="truncated"
        />

        <InfoGrid.Item label="Location" size={12} value={user?.location} />

        <InfoGrid.Item label="Home phone" size={12} value={user?.home_phone} />

        <InfoGrid.Item label="Work phone" size={12} value={user?.work_phone} />
      </InfoGrid>
    </>
  );
};

export default UserDetails;
