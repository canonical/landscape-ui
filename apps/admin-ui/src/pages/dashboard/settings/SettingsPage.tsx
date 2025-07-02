import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const SettingsPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/settings/general", { replace: true });
  }, []);

  return null;
};

export default SettingsPage;
