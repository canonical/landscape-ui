import { ROOT_PATH } from "@/constants";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router";

const AccountPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${ROOT_PATH}account/general`, { replace: true });
  }, []);

  return null;
};

export default AccountPage;
