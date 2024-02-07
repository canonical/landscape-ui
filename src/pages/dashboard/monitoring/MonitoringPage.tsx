import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "../../../constants";

const MonitoringPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${ROOT_PATH}monitoring/alerts`, { replace: true });
  }, []);

  return null;
};

export default MonitoringPage;
