import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import useSortByUrlParams from "@/hooks/useSortByUrlParams";
import useUsers from "@/hooks/useUsers";
import UserPanelHeader from "@/pages/dashboard/instances/[single]/tabs/users/UserPanelHeader";
import type { UrlParams } from "@/types/UrlParams";
import type { User } from "@/types/User";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { SORT_FUNCTIONS } from "../constants";
import UserList from "../UserList";
import { getFilteredUsers } from "./helpers";
import { MAX_USERS_LIMIT } from "./constants";
import { ROUTES } from "@/libs/routes";

const NewUserForm = lazy(() => import("../NewUserForm"));
const EditUserForm = lazy(() => import("../EditUserForm"));
const UserDetails = lazy(() => import("../UserDetails"));

const UserPanel: FC = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const {
    search,
    currentPage,
    pageSize,
    lastSidePathSegment,
    name,
    popSidePathUntilClear,
    createSidePathPusher,
  } = usePageParams();
  const { getUsersQuery } = useUsers();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  useSetDynamicFilterValidation("sidePath", ["add", "view", "edit"]);

  const { data: userResponse, isLoading } = getUsersQuery({
    computer_id: instanceId,
    limit: MAX_USERS_LIMIT,
  });

  const allUsers = userResponse?.data.results ?? [];

  const sortedUsers = useSortByUrlParams({
    data: allUsers,
    sortFunctions: SORT_FUNCTIONS,
  });

  const filteredUsers: User[] = getFilteredUsers(search, sortedUsers);

  const getPaginatedUsers = (limit: number, offset: number) => {
    return filteredUsers.slice(offset, offset + limit);
  };

  const users = useMemo(
    () => getPaginatedUsers(pageSize, (currentPage - 1) * pageSize),
    [search, filteredUsers, currentPage, pageSize],
  );

  const handleClearSelection = () => {
    setSelected([]);
  };

  const handleEmptyStateAddUser = createSidePathPusher("add");

  if (!search && isLoading) {
    return <LoadingState />;
  }

  const selectedUser = allUsers.find((u) => String(u.uid) === name);

  if (!search && (!userResponse || userResponse.data.results.length === 0)) {
    return (
      <>
        <EmptyState
          title="No users found"
          body="Add new users by clicking the button below."
          icon="connected"
          cta={[
            <Button
              type="button"
              key="empty-state-add-new-user"
              appearance="positive"
              onClick={handleEmptyStateAddUser}
            >
              Add user
            </Button>,
          ]}
        />
        <SidePanel
          onClose={popSidePathUntilClear}
          isOpen={lastSidePathSegment === "add"}
          size="small"
        >
          {lastSidePathSegment === "add" && (
            <SidePanel.Suspense key="add">
              <SidePanel.Header>Add new user</SidePanel.Header>
              <SidePanel.Content>
                <NewUserForm />
              </SidePanel.Content>
            </SidePanel.Suspense>
          )}
        </SidePanel>
      </>
    );
  }

  return (
    <>
      <UserPanelHeader
        selected={selected}
        handleClearSelection={handleClearSelection}
        users={users}
      />
      {userResponse && userResponse.data.count > MAX_USERS_LIMIT && (
        <Notification
          severity="caution"
          title={`Fetched ${MAX_USERS_LIMIT} out of ${userResponse.data.count} users`}
        >
          <span>
            The number of requested users is too high. Please{" "}
            <Link to={ROUTES.external.support()}>
              contact our support team.
            </Link>
          </span>
        </Notification>
      )}
      <UserList
        selected={selected}
        setSelected={(userIds) => {
          setSelected(userIds);
        }}
        users={users}
      />
      <TablePagination
        handleClearSelection={handleClearSelection}
        totalItems={filteredUsers.length}
        currentItemCount={users.length}
      />
      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={
          lastSidePathSegment === "add" ||
          (!!lastSidePathSegment && !!selectedUser)
        }
        size="small"
      >
        {lastSidePathSegment === "add" && (
          <SidePanel.Suspense key="add">
            <SidePanel.Header>Add new user</SidePanel.Header>
            <SidePanel.Content>
              <NewUserForm />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "view" && selectedUser && (
          <SidePanel.Suspense key="view">
            <SidePanel.Header>User details</SidePanel.Header>
            <SidePanel.Content>
              <UserDetails user={selectedUser} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && selectedUser && (
          <SidePanel.Suspense key="edit">
            <SidePanel.Header>Edit user</SidePanel.Header>
            <SidePanel.Content>
              <EditUserForm user={selectedUser} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </>
  );
};

export default UserPanel;
