import type { FC } from "react";
import AuthTemplate from "../templates/auth";
import { Link } from "react-router";
import { ROUTES } from "@/libs/routes";

const PageNotFound: FC = () => {
  return (
    <AuthTemplate title="Page not found">
      <p>It seems that page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        to={ROUTES.root.root()}
        className="p-button--positive u-no-margin--bottom"
      >
        Go back to the home page
      </Link>
    </AuthTemplate>
  );
};

export default PageNotFound;
