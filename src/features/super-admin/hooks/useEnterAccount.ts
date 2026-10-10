import { ROUTES } from "@/libs/routes";
import { useNavigate } from "react-router";

/**
 * Enters the account named `name` as Canonical staff by opening its support
 * session, which switches the session into the account as it mounts (see
 * `SupportSessionContainer`) and reports a refused switch in place.
 */
export const useEnterAccount = () => {
  const navigate = useNavigate();

  const enterAccount = (name: string) => {
    navigate(ROUTES.superAdmin.session(name));
  };

  return { enterAccount };
};
