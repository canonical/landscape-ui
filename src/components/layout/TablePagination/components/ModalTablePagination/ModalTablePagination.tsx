import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./ModalTablePagination.module.scss";

export interface ModalTablePaginationProps {
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly current: number;
  readonly max: number;
  readonly isExact?: boolean;
}

const ModalTablePagination: FC<ModalTablePaginationProps> = ({
  onPrev,
  onNext,
  max,
  current,
  isExact = true,
}) => {
  if (max <= 1) {
    return null;
  }

  return (
    <div className={classes.pagination}>
      <div className={classes.inner}>
        <Button
          type="button"
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
          {isExact ? "" : "+"}
        </span>
        <Button
          type="button"
          className="u-no-margin--bottom"
          appearance="base"
          hasIcon
          onClick={onNext}
          // keep enabled until we know it's actually the last page
          disabled={current >= max && isExact}
          aria-label="Next page"
        >
          <Icon name="chevron-right" />
        </Button>
      </div>
    </div>
  );
};

export default ModalTablePagination;
