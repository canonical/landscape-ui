import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbsProps {}

const Breadcrumbs: FC<BreadcrumbsProps> = () => {
  const { pathname } = useLocation();

  const paths = pathname.split("/").filter((path) => path !== "");

  return (
    <nav className="p-breadcrumbs" aria-label="Breadcrumbs">
      <ol className="p-breadcrumbs__items u-no-margin--bottom">
        {paths.map((path, index) =>
          index !== paths.length - 1 ? (
            <li className="p-breadcrumbs__item" key={index}>
              <Link
                to={`/${paths
                  .filter((_, pathIndex) => pathIndex <= index)
                  .join("/")}`}
              >
                {path}
              </Link>
            </li>
          ) : (
            <li className="p-breadcrumbs__item" key={index}>
              {path}
            </li>
          )
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
