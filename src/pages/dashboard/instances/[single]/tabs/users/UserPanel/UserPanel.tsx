import { MainTable } from "@canonical/react-components";
import { FC, lazy, Suspense, useMemo, useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import TablePagination from "@/components/layout/TablePagination";
import useSidePanel from "@/hooks/useSidePanel";
import useUsers from "@/hooks/useUsers";
import { User } from "@/types/User";
import UserPanelHeader from "@/pages/dashboard/instances/[single]/tabs/users/UserPanelHeader";
import { getFilteredUsers, getHeaders, getRows } from "./helpers";

const MAX_USERS_LIMIT = 1000;

interface UserPanelProps {
  instanceId: number;
}

const EditUserForm = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/users/EditUserForm"),
);
const UserDetails = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/users/UserDetails"),
);

const UserPanel: FC<UserPanelProps> = ({ instanceId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(20);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const { setSidePanelContent } = useSidePanel();
  const { getUsersQuery } = useUsers();
  const { data: userResponse } = getUsersQuery({
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

  const toggleAll = () => {
    setSelected((prevState) =>
      0 === prevState.length ? users.map(({ uid }) => uid) : [],
    );
  };

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
    setSelected([]);
  };

  const handleEditUser = (user: User) => {
    setSidePanelContent(
      "Edit user",
      <Suspense fallback={<LoadingState />}>
        <EditUserForm instanceId={instanceId} user={user} />
      </Suspense>,
    );
  };

  const handleShowUserDetails = (user: User) => {
    setSidePanelContent(
      "User details",
      <Suspense fallback={<LoadingState />}>
        <UserDetails
          user={user}
          instanceId={instanceId}
          handleEditUser={handleEditUser}
        />
      </Suspense>,
    );
  };

  const headers = getHeaders(selected.length, users.length, toggleAll);

  const rows = getRows(
    users,
    selected,
    setSelected,
    handleEditUser,
    handleShowUserDetails,
  );

  return (
    <>
      <UserPanelHeader
        instanceId={instanceId}
        onPageChange={handlePaginate}
        onSearch={(searchText) => setSearch(searchText)}
        selected={selected}
        setSelected={setSelected}
        users={users}
      />
      <MainTable
        headers={headers}
        rows={rows}
        emptyStateMsg="No users found."
        sortable
      />
      <TablePagination
        currentPage={currentPage}
        totalItems={filteredUsers.length}
        paginate={handlePaginate}
        pageSize={usersPerPage}
        setPageSize={(usersNumber) => {
          setUsersPerPage(usersNumber);
        }}
        currentItemCount={rows.length}
      />
    </>
  );
};

export default UserPanel;
