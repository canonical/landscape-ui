import type { FC } from "react";
import { Button, Icon } from "@canonical/react-components";
import classes from "./TagsAddPagination.module.scss";

export interface TagsAddPaginationProps {
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly current: number;
  readonly max: number;
}

const TagsAddPagination: FC<TagsAddPaginationProps> = ({
  onPrev,
  onNext,
  max,
  current,
}) => {
  return (
    <div className={classes.pagination}>
      <div className={classes.inner}>
        <Button
          className="u-no-margin--right u-no-margin--bottom"
          appearance="base"
          hasIcon
          onClick={onPrev}
          disabled={current <= 1}
          aria-label="Previous page"
        >
          <Icon name="chevron-left" />
        </Button>
        <span>
          Page {current} of {max}
        </span>
        <Button
          className="u-no-margin--bottom"
          appearance="base"
          hasIcon
          onClick={onNext}
          disabled={current >= max}
          aria-label="Next page"
        >
          <Icon name="chevron-right" />
        </Button>
      </div>
    </div>
  );
};

export default TagsAddPagination;
