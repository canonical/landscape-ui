import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import useSortByUrlParams from "@/hooks/useSortByUrlParams";
import useUsers from "@/hooks/useUsers";
import UserPanelHeader from "@/pages/dashboard/instances/[single]/tabs/users/UserPanelHeader";
import { UrlParams } from "@/types/UrlParams";
import { User } from "@/types/User";
import { Button, Notification } from "@canonical/react-components";
import { FC, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SORT_FUNCTIONS } from "../constants";
import NewUserForm from "../NewUserForm";
import UserList from "../UserList";
import { getFilteredUsers } from "./helpers";
import classes from "./UserPanel.module.scss";
import { MAX_USERS_LIMIT } from "./constants";

const UserPanel: FC = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const { search, currentPage, pageSize } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getUsersQuery } = useUsers();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

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

  const handleEmptyStateAddUser = () => {
    setSidePanelContent("Add new user", <NewUserForm />);
  };

  return (
    <>
      {!search && isLoading && <LoadingState />}
      {!isLoading &&
        !search &&
        (!userResponse || userResponse.data.results.length === 0) && (
          <EmptyState
            title="No users found"
            body="Add new users by clicking the button below"
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
        )}
      {(search || (!isLoading && users.length > 0)) && (
        <>
          <UserPanelHeader
            selected={selected}
            handleClearSelection={handleClearSelection}
            users={users}
          />
          {userResponse?.data.count &&
            userResponse.data.count > MAX_USERS_LIMIT && (
              <Notification
                severity="caution"
                title={`Fetched ${MAX_USERS_LIMIT} out of ${userResponse?.data.count} users`}
              >
                <span>
                  The number of requested users is too high. Please{" "}
                  <Link
                    to="https://support-portal.canonical.com/"
                    className={classes.link}
                  >
                    contact our support team.
                  </Link>
                </span>
              </Notification>
            )}
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
