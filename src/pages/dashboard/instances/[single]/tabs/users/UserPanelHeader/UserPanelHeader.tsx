import { Form, SearchBox } from "@canonical/react-components";
import { FC, FormEvent, useState } from "react";
import classes from "./UserPanelHeader.module.scss";
import UserPanelActionButtons from "../UserPanelActionButtons";
import { User } from "@/types/User";
import { getSelectedUsers } from "./helpers";

interface UserPanelHeaderProps {
  instanceId: number;
  onPageChange: (page: number) => void;
  onSearch: (searchText: string) => void;
  selected: number[];
  setSelected: (selected: number[]) => void;
  users: User[];
}

const UserPanelHeader: FC<UserPanelHeaderProps> = ({
  instanceId,
  onPageChange,
  onSearch,
  selected,
  setSelected,
  users,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSearch = (searchText = inputText) => {
    onSearch(searchText);
    onPageChange(1);
  };

  const handleClearSearchBox = () => {
    setInputText("");
    handleSearch("");
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
            aria-label="User search"
            value={inputText}
            onChange={(inputValue) => {
              setInputText(inputValue);
            }}
            className="u-no-margin--bottom"
            onClear={handleClearSearchBox}
          />
        </Form>
      </div>
      <UserPanelActionButtons
        instanceId={instanceId}
        setSelected={setSelected}
        selectedUsers={getSelectedUsers(users, selected)}
      />
    </div>
  );
};

export default UserPanelHeader;
