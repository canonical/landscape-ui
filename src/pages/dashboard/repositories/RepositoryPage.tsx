import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const RepositoryPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTES.repositoriesMirrors(), { replace: true });
  }, []);

  return null;
};

export default RepositoryPage;
