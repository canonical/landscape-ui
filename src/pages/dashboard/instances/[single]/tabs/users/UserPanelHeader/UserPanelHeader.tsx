import type { FC } from "react";
import classes from "./UserPanelHeader.module.scss";
import UserPanelActionButtons from "../UserPanelActionButtons";
import type { User } from "@/types/User";
import { getSelectedUsers } from "./helpers";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { TableFilterChips } from "@/components/filter";

interface UserPanelHeaderProps {
  readonly selected: number[];
  readonly handleClearSelection: () => void;
  readonly users: User[];
}

const UserPanelHeader: FC<UserPanelHeaderProps> = ({
  selected,
  handleClearSelection,
  users,
}) => {
  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.actions}>
            <UserPanelActionButtons
              handleClearSelection={handleClearSelection}
              selectedUsers={getSelectedUsers(users, selected)}
            />
          </div>
        }
      />
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default UserPanelHeader;
