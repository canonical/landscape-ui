import { FC, ReactNode } from "react";
import classes from "./PageHeader.module.scss";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../../types/Breadcrumb";

interface PageHeaderProps {
  title: string;
  hideTitle?: boolean;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode[];
  className?: string;
  visualTitle?: string;
  sticky?: boolean;
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  visualTitle,
  hideTitle,
  className,
  actions,
  breadcrumbs,
  sticky = false,
}) => {
  return (
    <>
      <div
        className={classNames(
          "p-panel__header",
          { [classes.sticky]: sticky },
          className,
        )}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className={classes.breadcrumbs}>
            <nav className="p-breadcrumbs" aria-label="Breadcrumbs">
              <ol className="p-breadcrumbs__items u-no-margin--bottom">
                {breadcrumbs.map((breadcrumb, index) =>
                  !breadcrumb.current ? (
                    <li className="p-breadcrumbs__item" key={index}>
                      <Link to={breadcrumb.path ?? ""}>{breadcrumb.label}</Link>
                    </li>
                  ) : (
                    <li
                      className="p-breadcrumbs__item"
                      key={index}
                      aria-current="page"
                    >
                      {breadcrumb.label}
                    </li>
                  ),
                )}
              </ol>
            </nav>
          </div>
        )}
        {hideTitle ? (
          <>
            <h1 className="u-off-screen">{title}</h1>
            <div className={classNames("p-panel__title", classes.visualTitle)}>
              {visualTitle}
            </div>
          </>
        ) : (
          <h1 className="p-panel__title">{title}</h1>
        )}
        {actions && actions.length > 0 && (
          <div className={classNames("p-panel__controls", classes.controls)}>
            {actions}
          </div>
        )}
      </div>
    </>
  );
};

export default PageHeader;
