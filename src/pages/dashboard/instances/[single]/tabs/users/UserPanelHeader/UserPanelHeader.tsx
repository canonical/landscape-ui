import { Form, SearchBox } from "@canonical/react-components";
import { FC, FormEvent, useState } from "react";
import classes from "./UserPanelHeader.module.scss";
import UserPanelActionButtons from "../UserPanelActionButtons";
import { User } from "@/types/User";
import { getSelectedUsers } from "./helpers";
import { usePageParams } from "@/hooks/usePageParams";

interface UserPanelHeaderProps {
  selected: number[];
  handleClearSelection: () => void;
  users: User[];
}

const UserPanelHeader: FC<UserPanelHeaderProps> = ({
  selected,
  handleClearSelection,
  users,
}) => {
  const { search, setPageParams } = usePageParams();

  const [searchText, setSearchText] = useState(search);

  const handleSearch = () => {
    setPageParams({
      search: searchText,
    });
    handleClearSelection();
  };

  const handleClear = () => {
    setPageParams({
      search: "",
    });
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <div className={classes.headerContainer}>
      <div className={classes.searchContainer}>
        <Form onSubmit={handleSearchSubmit} noValidate>
          <SearchBox
            externallyControlled
            shouldRefocusAfterReset
            value={searchText}
            onChange={(inputValue) => setSearchText(inputValue)}
            onClear={handleClear}
          />
        </Form>
      </div>
      <UserPanelActionButtons
        handleClearSelection={handleClearSelection}
        selectedUsers={getSelectedUsers(users, selected)}
      />
    </div>
  );
};

export default UserPanelHeader;
