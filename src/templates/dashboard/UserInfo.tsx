import { FC } from "react";
import useAuth from "../../hooks/useAuth";
import { Button } from "@canonical/react-components";
import classes from "./UserInfo.module.scss";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { ROOT_PATH } from "@/constants";

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
        to={`${ROOT_PATH}user`}
        className={classNames("p-side-navigation__link", classes.link)}
      >
        <i
          className={classNames(
            `p-icon--account is-light p-side-navigation__icon`,
            classes.icon,
          )}
        />
        <span className={classNames("p-side-navigation__label", classes.label)}>
          {user?.name ?? "Unknown user"}
        </span>
      </Link>
      <Link
        className={classNames("p-side-navigation__link", classes.link)}
        to={`${ROOT_PATH}alerts`}
      >
        <i
          className={classNames(
            `p-icon--bell is-light p-side-navigation__icon`,
            classes.icon,
          )}
        />
        <span className={classNames("p-side-navigation__label", classes.label)}>
          Alerts
        </span>
      </Link>
      <Button
        appearance="base"
        className={classNames(
          "p-side-navigation__link",
          classes.link,
          classes.logoutButton,
        )}
        onClick={logout}
      >
        <i
          className={classNames(
            `p-icon--logout is-light p-side-navigation__icon`,
            classes.icon,
          )}
        />
        <span className={classNames("p-side-navigation__label", classes.label)}>
          Log out
        </span>
      </Button>
    </div>
  );
};

export default UserInfo;
