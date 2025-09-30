import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const AccountPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTES.account.general(), { replace: true });
  }, []);

  return null;
};

export default AccountPage;
