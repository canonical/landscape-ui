import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import TablePagination from "@/components/layout/TablePagination";
import useUsers from "@/hooks/useUsers";
import UserPanelHeader from "@/pages/dashboard/instances/[single]/tabs/users/UserPanelHeader";
import { User } from "@/types/User";
import { FC, useMemo, useState } from "react";
import UserList from "../UserList";
import { getFilteredUsers } from "./helpers";
import useSidePanel from "@/hooks/useSidePanel";
import NewUserForm from "../NewUserForm";
import { Button } from "@canonical/react-components";

const MAX_USERS_LIMIT = 1000;

interface UserPanelProps {
  instanceId: number;
}

const UserPanel: FC<UserPanelProps> = ({ instanceId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(20);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const { setSidePanelContent } = useSidePanel();
  const { getUsersQuery } = useUsers();
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

  const users = getUsers(usersPerPage, (currentPage - 1) * usersPerPage);

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
    setSelected([]);
  };

  const handleEmptyStateAddUser = () => {
    setSidePanelContent(
      "Add new user",
      <NewUserForm instanceId={instanceId} />,
    );
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
            instanceId={instanceId}
            onPageChange={handlePaginate}
            onSearch={(searchText) => setSearch(searchText)}
            selected={selected}
            setSelected={setSelected}
            users={users}
          />
          <UserList
            instanceId={instanceId}
            selected={selected}
            setSelected={setSelected}
            users={users}
          />
        </>
      )}
      <TablePagination
        currentPage={currentPage}
        totalItems={filteredUsers.length}
        paginate={handlePaginate}
        pageSize={usersPerPage}
        setPageSize={(usersNumber) => {
          setUsersPerPage(usersNumber);
        }}
        currentItemCount={users.length}
      />
    </>
  );
};

export default UserPanel;
