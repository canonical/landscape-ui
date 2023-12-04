import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "../../../constants";

const AccountPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${ROOT_PATH}account/overview`, { replace: true });
  }, []);

  return null;
};

export default AccountPage;
