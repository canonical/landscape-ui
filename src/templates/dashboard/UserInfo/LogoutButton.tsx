import type { FC } from "react";
import classNames from "classnames";
import { ActionButton, Icon } from "@canonical/react-components";
import { useAuthHandle } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import classes from "./UserInfo.module.scss";

/** The sidebar "Sign out" entry: ends the server session, then the local one. */
const LogoutButton: FC = () => {
  const { logout } = useAuth();
  const { handleLogoutQuery } = useAuthHandle();
  const debug = useDebug();

  const {
    mutateAsync: deleteSessionCookies,
    isPending: isDeletingSessionCookies,
  } = handleLogoutQuery;

  const handleLogout = async () => {
    try {
      await deleteSessionCookies();

      logout();
    } catch (error) {
      debug(error);
    }
  };

  return (
    <ActionButton
      type="button"
      appearance="base"
      className={classNames(
        "u-no-margin--bottom",
        classes.link,
        classes.button,
      )}
      onClick={handleLogout}
      loading={isDeletingSessionCookies}
    >
      <Icon
        name="logout"
        className={classNames("is-light p-side-navigation__icon", classes.icon)}
      />
      <span className={classNames("p-side-navigation__label", classes.label)}>
        Sign out
      </span>
    </ActionButton>
  );
};

export default LogoutButton;
