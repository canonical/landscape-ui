import { FC } from "react";
import useAuth from "../../hooks/useAuth";
import { Button } from "@canonical/react-components";
import classes from "./UserInfo.module.scss";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

const UserInfo: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
          "p-side-navigation__link is-dark u-no-margin--bottom",
          classes.button,
        )}
        onClick={() => {
          navigate("/user");
        }}
      >
        <i className="p-icon--account" />
        <span className="p-side-navigation__label">
          {user?.name ?? "Unknown user"}
        </span>
      </Button>
      <Button
        appearance="base"
        className={classNames(
          "p-side-navigation__link is-dark u-no-margin--bottom",
          classes.button,
        )}
        onClick={() => {
          navigate("/notifications");
        }}
      >
        <i className="p-icon--bell" />
        <span className="p-side-navigation__label">Notifications</span>
      </Button>
      <Button
        appearance="base"
        className={classNames(
          "p-side-navigation__link is-dark u-no-margin--bottom",
          classes.button,
        )}
        onClick={logout}
      >
        <i className="p-icon--logout" />
        <span className="p-side-navigation__label">Log out</span>
      </Button>
    </div>
  );
};

export default UserInfo;
