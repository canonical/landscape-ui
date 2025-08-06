import Menu from "@/components/layout/Menu";
import NoData from "@/components/layout/NoData";
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
      <Menu>
        <Menu.Row>
          <Menu.Row.Item label="Username" size={12} value={user.username} />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item
            label="Name"
            size={12}
            value={user.name || <NoData />}
          />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item label="Passphrase" size={12} type="password" />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item label="Primary group" size={12} value={primaryGroup} />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item
            label="Additional groups"
            size={12}
            value={userGroups}
            type="truncated"
          />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item label="Location" size={12} value={user?.location} />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item
            label="Home phone"
            size={12}
            value={user?.home_phone}
          />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item
            label="Work phone"
            size={12}
            value={user?.work_phone}
          />
        </Menu.Row>
      </Menu>
    </>
  );
};

export default UserDetails;
