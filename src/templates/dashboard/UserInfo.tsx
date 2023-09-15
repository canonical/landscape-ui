import { FC } from "react";
import useAuth from "../../hooks/useAuth";
import { Button } from "@canonical/react-components";
import classes from "./UserInfo.module.scss";
import classNames from "classnames";

const UserInfo: FC = () => {
  const { user, logout } = useAuth();

  return (
    <div
      className={classNames(
        "p-side-navigation--icons is-dark",
        classes.container,
      )}
    >
      <Button
        appearance="base"
        className={classNames(
          "p-side-navigation__link is-dark u-no-margin--bottom u-no-margin--right",
          classes.button,
        )}
      >
        <span className="p-side-navigation__label">
          {user?.email ?? "user_email"}
        </span>
      </Button>
      <Button
        appearance="base"
        className={classNames(
          "p-side-navigation__link is-dark u-no-margin--bottom",
          classes.button,
        )}
        onClick={logout}
      >
        <span className="p-side-navigation__label">Log out</span>
      </Button>
    </div>
  );
};

export default UserInfo;
