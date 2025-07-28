import type { FC } from "react";
import classNames from "classnames";
import classes from "../../AlertCard.module.scss";
import { pluralize } from "@/utils/_helpers";
import { Link } from "react-router";
import { Button } from "@canonical/react-components";

const LinkLabel: FC<{ readonly count: number }> = ({ count }) => (
  <>
    <span className={classes.instancesNumber}>{count}</span>{" "}
    {pluralize(count, "instance")}
  </>
);

interface AlertLinkProps {
  readonly count: number;
  readonly to?: string;
  readonly onClick?: () => void;
}

const AlertLink: FC<AlertLinkProps> = ({ count, to, onClick }) => {
  if (to) {
    return (
      <Link
        className={classNames("u-no-margin u-no-padding", classes.link)}
        to={to}
      >
        <LinkLabel count={count} />
      </Link>
    );
  }

  if (onClick) {
    return (
      <Button
        type="button"
        appearance="link"
        className={classNames("u-no-margin u-no-padding", classes.link)}
        onClick={onClick}
      >
        <LinkLabel count={count} />
      </Button>
    );
  }

  return null;
};

export default AlertLink;
