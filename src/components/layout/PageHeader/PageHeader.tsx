import { FC, ReactNode } from "react";
import classes from "./PageHeader.module.scss";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../../../types/Breadcrumb";
import { useMediaQuery } from "usehooks-ts";

interface PageHeaderProps {
  title: string;
  hideTitle?: boolean;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode[];
  className?: string;
  visualTitle?: string;
  sticky?: boolean;
  helperContent?: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  visualTitle,
  hideTitle,
  className,
  actions,
  breadcrumbs,
  helperContent,
  sticky = false,
}) => {
  const isSmallerScreen = useMediaQuery("(max-width: 619px)");
  return (
    <div
      className={classNames(
        "p-panel__header",
        {
          [classes.sticky]: sticky,
          "u-no-padding--right": helperContent !== undefined,
        },
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
          {visualTitle && (
            <div
              className={classNames("p-panel__title", classes.visualTitle, {
                "u-no-padding--bottom": isSmallerScreen,
              })}
            >
              {visualTitle}
            </div>
          )}
        </>
      ) : (
        <>
          <h1
            className={classNames("p-panel__title", {
              "u-no-padding--bottom": isSmallerScreen,
            })}
          >
            {title}
          </h1>
          <>{helperContent}</>
        </>
      )}
      {actions && actions.length > 0 && (
        <div className={classNames("p-panel__controls", classes.controls)}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
