import {
  Col,
  Form,
  MainTable,
  Row,
  SearchBox,
} from "@canonical/react-components";
import classNames from "classnames";
import { FC, FormEvent, Suspense, lazy, useMemo, useState } from "react";
import LoadingState from "../../../../../../components/layout/LoadingState";
import TablePagination from "../../../../../../components/layout/TablePagination";
import useSidePanel from "../../../../../../hooks/useSidePanel";
import useUsers from "../../../../../../hooks/useUsers";
import { User } from "../../../../../../types/User";
import classes from "./UserPanel.module.scss";
import UserPanelActionButtons from "./UserPanelActionButtons";
import {
  getFilteredUsers,
  getHeaders,
  getRows,
  getSelectedUsers,
} from "./_helpers";

const MAX_USERS_LIMIT = 1000;

interface UserPanelProps {
  machineId: number;
}

const EditUserForm = lazy(() => import("../../../EditUserForm"));
const UserDetails = lazy(() => import("./UserDetails"));

const UserPanel: FC<UserPanelProps> = ({ machineId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(20);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [confirmedSearchString, setConfirmedSearchString] = useState("");

  const { setSidePanelContent } = useSidePanel();
  const { getUsersQuery } = useUsers();
  const { data: userResponse } = getUsersQuery({
    computer_id: machineId,
    limit: MAX_USERS_LIMIT,
  });

  const allUsers = userResponse?.data.results ?? [];

  const filteredUsers: User[] = useMemo(
    () => getFilteredUsers(confirmedSearchString, allUsers),
    [confirmedSearchString, allUsers],
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

  const handleClearSearchBox = () => {
    setSearch("");
    setConfirmedSearchString("");
    setSelected([]);
    setCurrentPage(1);
  };

  const handleEditUser = (user: User) => {
    setSidePanelContent(
      "Edit user",
      <Suspense fallback={<LoadingState />}>
        <EditUserForm machineId={machineId} user={user} />
      </Suspense>,
    );
  };

  const handleShowUserDetails = (user: User) => {
    setSidePanelContent(
      "User details",
      <Suspense fallback={<LoadingState />}>
        <UserDetails
          user={user}
          machineId={machineId}
          handleEditUser={handleEditUser}
        />
      </Suspense>,
    );
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmedSearchString(search);
    setCurrentPage(1);
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
      <Row
        className={classNames(
          "u-no-padding u-no-margin u-no-max-width",
          classes.row,
        )}
      >
        <Col small={4} medium={2} size={3}>
          <Form onSubmit={handleFormSubmit} noValidate>
            <SearchBox
              externallyControlled
              shouldRefocusAfterReset
              aria-label="User search"
              value={search}
              onChange={(inputValue) => {
                setSearch(inputValue);
              }}
              className="u-no-margin--bottom"
              onClear={handleClearSearchBox}
            />
          </Form>
        </Col>
        <Col small={4} medium={4} size={9}>
          <UserPanelActionButtons
            machineId={machineId}
            setSelected={setSelected}
            selectedUsers={getSelectedUsers(users, selected)}
          />
        </Col>
      </Row>
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
