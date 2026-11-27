import { Button } from "@canonical/react-ds-global";
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
    return null;
  }

  return (
    <div className={classes.pagination}>
      <div className={classes.inner}>
        <Button
          type="button"
          importance="tertiary"
          icon="chevron-left"
          onClick={onPrev}
          disabled={current <= 1}
          aria-label="Previous page"
        />
        <span>
          Page {current} of {max}
        </span>
        <Button
          type="button"
          importance="tertiary"
          icon="chevron-right"
          onClick={onNext}
          disabled={current >= max}
          aria-label="Next page"
        />
      </div>
    </div>
  );
};

export default ModalTablePagination;
