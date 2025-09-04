import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./ModalTablePagination.module.scss";

export interface ModalTablePaginationProps {
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly current: number;
  readonly max: number;
}

const ModalTablePagination: FC<ModalTablePaginationProps> = ({
  onPrev,
  onNext,
  max,
  current,
}) => {
  if (max <= 1) {
    return;
  }

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

export default ModalTablePagination;
