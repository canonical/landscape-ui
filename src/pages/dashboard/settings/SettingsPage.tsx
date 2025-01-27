import { FC, useEffect } from "react";
import { useNavigate } from "react-router";
import { ROOT_PATH } from "../../../constants";

const SettingsPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${ROOT_PATH}settings/general`, { replace: true });
  }, []);

  return null;
};

export default SettingsPage;
