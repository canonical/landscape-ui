import { FC } from "react";
import useAuth from "../../hooks/useAuth";
import { Button } from "@canonical/react-components";
import classes from "./UserInfo.module.scss";
import classNames from "classnames";
import { OLD_DASHBOARD_URL } from "../../constants";
import { Link } from "react-router-dom";

const UserInfo: FC = () => {
  const { user, logout } = useAuth();

  return (
    <div
      className={classNames(
        "p-side-navigation--icons is-dark",
        classes.container,
      )}
    >
      <Link
        to={"user/account"}
        className={classNames("p-side-navigation__label", classes.label)}
      >
        {user?.email ?? "Unknown user"}
      </Link>
      <a
        href={OLD_DASHBOARD_URL}
        className={classNames(
          "p-side-navigation__link is-dark u-no-margin--bottom u-no-margin--right",
          classes.button,
        )}
      >
        <i className="p-icon--double-chevron-left" />
        <span className="p-side-navigation__label">Old dashboard</span>
      </a>
      <Button
        appearance="base"
        className={classNames(
          "p-side-navigation__link is-dark u-no-margin--bottom",
          classes.button,
        )}
        onClick={logout}
      >
        <i className={classNames("p-icon--logout", classes.icon)} />
        <span className="p-side-navigation__label">Log out</span>
      </Button>
    </div>
  );
};

export default UserInfo;
