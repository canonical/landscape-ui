import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { Navigate } from "react-router";

const RepositoryPage: FC = () => {
  return <Navigate to={ROUTES.repositories.mirrors()} replace />;
};

export default RepositoryPage;
