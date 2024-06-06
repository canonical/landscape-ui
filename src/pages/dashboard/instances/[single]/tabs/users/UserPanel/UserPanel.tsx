import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import useUsers from "@/hooks/useUsers";
import UserPanelHeader from "@/pages/dashboard/instances/[single]/tabs/users/UserPanelHeader";
import { User } from "@/types/User";
import { FC, useMemo, useState } from "react";
import UserList from "../UserList";
import { getFilteredUsers } from "./helpers";
import useSidePanel from "@/hooks/useSidePanel";
import NewUserForm from "../NewUserForm";
import { Button } from "@canonical/react-components";
import { usePageParams } from "@/hooks/usePageParams";
import { useParams } from "react-router-dom";

const MAX_USERS_LIMIT = 1000;

const UserPanel: FC = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const { instanceId: urlInstanceId } = useParams();
  const { search, currentPage, pageSize } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getUsersQuery } = useUsers();

  const instanceId = Number(urlInstanceId);

  const { data: userResponse, isLoading } = getUsersQuery({
    computer_id: instanceId,
    limit: MAX_USERS_LIMIT,
  });

  const allUsers = userResponse?.data.results ?? [];

  const filteredUsers: User[] = useMemo(
    () => getFilteredUsers(search, allUsers),
    [search, allUsers],
  );

  const getUsers = (limit: number, offset: number) => {
    return filteredUsers.slice(offset, offset + limit);
  };

  const users = getUsers(pageSize, (currentPage - 1) * pageSize);

  const handleClearSelection = () => {
    setSelected([]);
  };

  const handleEmptyStateAddUser = () => {
    setSidePanelContent("Add new user", <NewUserForm />);
  };

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading &&
        (!userResponse || userResponse.data.results.length === 0) && (
          <EmptyState
            title="No users found"
            body="Add new users by clicking the button below"
            icon="connected"
            cta={[
              <Button
                key="empty-state-add-new-user"
                appearance="positive"
                onClick={handleEmptyStateAddUser}
              >
                Add user
              </Button>,
            ]}
          />
        )}
      {!isLoading && filteredUsers.length && (
        <>
          <UserPanelHeader
            selected={selected}
            handleClearSelection={handleClearSelection}
            users={users}
          />
          <UserList
            selected={selected}
            setSelected={(userIds) => setSelected(userIds)}
            users={users}
          />
        </>
      )}
      <TablePagination
        handleClearSelection={handleClearSelection}
        totalItems={filteredUsers.length}
        currentItemCount={users.length}
      />
    </>
  );
};

export default UserPanel;
