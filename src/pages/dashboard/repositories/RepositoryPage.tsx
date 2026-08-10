import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const RepositoryPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTES.repositories.mirrors(), { replace: true });
  }, [navigate]);

  return null;
};

export default RepositoryPage;
