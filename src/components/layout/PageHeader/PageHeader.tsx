import classNames from "classnames";
import {
  Breadcrumbs,
  type LinkComponentProps,
} from "@canonical/react-ds-global";
import { type FC, type ReactNode, useLayoutEffect, useRef } from "react";
import { Link } from "react-router";
import { useMediaQuery } from "usehooks-ts";
import type { Breadcrumb } from "../../../types/Breadcrumb";
import classes from "./PageHeader.module.scss";

interface PageHeaderProps {
  readonly title: string;
  readonly hideTitle?: boolean;
  readonly breadcrumbs?: Breadcrumb[];
  readonly actions?: ReactNode[];
  readonly className?: string;
  readonly visualTitle?: string;
  readonly helperContent?: ReactNode;
}

const BreadcrumbLink: FC<LinkComponentProps> = ({
  href = "",
  children,
  ...props
}) => (
  <Link to={href} {...props}>
    {children}
  </Link>
);

const PageHeader: FC<PageHeaderProps> = ({
  title,
  visualTitle,
  hideTitle,
  className,
  actions,
  breadcrumbs,
  helperContent,
}) => {
  const isSmallerScreen = useMediaQuery("(max-width: 619px)");
  const headerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!headerRef.current) {
      return;
    }

    const { height } = headerRef.current.getBoundingClientRect();
    document.documentElement.style.setProperty(
      "--pageheader-height",
      `${height}px`,
    );
  }, []);

  return (
    <div
      ref={headerRef}
      className={classNames(
        "p-panel__header",
        {
          "u-no-padding--right": helperContent !== undefined,
        },
        className,
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className={classes.breadcrumbs}>
          <Breadcrumbs
            aria-label="Breadcrumbs"
            LinkComponent={BreadcrumbLink}
            items={breadcrumbs.map((breadcrumb) =>
              breadcrumb.current
                ? { label: breadcrumb.label, current: true, key: "current" }
                : {
                    label: breadcrumb.label,
                    url: breadcrumb.path,
                  },
            )}
          />
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
