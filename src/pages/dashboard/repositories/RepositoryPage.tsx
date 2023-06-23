import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RepositoryPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/repositories/mirrors", { replace: true });
  }, []);

  return null;
};

export default RepositoryPage;
