import { FC } from "react";
import InfoItem from "@/components/layout/InfoItem";
import { User } from "@/types/User";
import UserPanelActionButtons from "../UserPanelActionButtons";
import useUsers from "@/hooks/useUsers";
import { NOT_AVAILABLE } from "@/constants";

interface UserDetailsProps {
  user: User;
  instanceId: number;
  handleEditUser: (user: User) => void;
}

const UserDetails: FC<UserDetailsProps> = ({
  user,
  instanceId,
  handleEditUser,
}) => {
  const { getGroupsQuery, getUserGroupsQuery } = useUsers();
  const { data: allGroupsData } = getGroupsQuery({ computer_id: instanceId });
  const { data: userGroupsData } = getUserGroupsQuery({
    username: user.username,
    computer_id: instanceId,
  });

  const groupsData = allGroupsData?.data.groups ?? [];
  const primaryGroup = groupsData?.find(
    (group) => group.gid === user.primary_gid,
  )?.name;
  const userGroups =
    userGroupsData?.data.groups.map((group) => group.name).join(", ") || "-";

  return (
    <>
      <UserPanelActionButtons
        selectedUsers={[user]}
        instanceId={instanceId}
        handleEditUser={handleEditUser}
      />
      <InfoItem label="username" value={user.username} />
      <InfoItem
        label="name"
        value={user.name !== "" ? user.name : NOT_AVAILABLE}
      />
      <InfoItem label="passphrase" type="password" />
      <InfoItem label="primary group" value={primaryGroup ?? "-"} />
      <InfoItem label="additional groups" type="truncated" value={userGroups} />
      <InfoItem label="location" value={user?.location ?? "-"} />
      <InfoItem label="home phone" value={user?.home_phone ?? "-"} />
      <InfoItem label="work phone" value={user?.work_phone ?? "-"} />
    </>
  );
};

export default UserDetails;
