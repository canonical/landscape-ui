import { FC } from "react";
import classes from "./UserPanelHeader.module.scss";
import UserPanelActionButtons from "../UserPanelActionButtons";
import { User } from "@/types/User";
import { getSelectedUsers } from "./helpers";
import usePageParams from "@/hooks/usePageParams";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";

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
  const { setPageParams } = usePageParams();

  const handleSearch = (searchText: string) => {
    setPageParams({ search: searchText });
    handleClearSelection();
  };

  return (
    <HeaderWithSearch
      onSearch={handleSearch}
      actions={
        <div className={classes.actions}>
          <UserPanelActionButtons
            handleClearSelection={handleClearSelection}
            selectedUsers={getSelectedUsers(users, selected)}
          />
        </div>
      }
    />
  );
};

export default UserPanelHeader;
