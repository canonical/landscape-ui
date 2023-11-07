import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "../../../constants";

const RepositoryPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${ROOT_PATH}repositories/mirrors`, { replace: true });
  }, []);

  return null;
};

export default RepositoryPage;
