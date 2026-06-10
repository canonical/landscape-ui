import type { Operation } from "@/features/operations";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./OperationStatusCell.module.scss";

interface OperationStatusCellProps {
  readonly operation: Operation | undefined;
}

const OperationStatusCell: FC<OperationStatusCellProps> = ({ operation }) => {
  const { createPageParamsSetter } = usePageParams();
  const { status, progressPercent = 0 } = operation?.metadata ?? {};

  if (!operation || !status) {
    return "Not yet updated";
  }

  if (status === "succeeded") {
    return "Updated";
  }

  if (status === "failed") {
    return (
      <>
        <span>Update failed</span>
        <Button
          className={classes.button}
          type="button"
          appearance="link"
          onClick={createPageParamsSetter({
            sidePath: ["logs"],
            name: operation?.name,
          })}
        >
          View logs
        </Button>
      </>
    );
  }

  return (
    <>
      Updating
      <div className={classes.progressBar}>
        <div style={{ width: `${progressPercent}%` }} />
      </div>
      <span className="u-text--muted">{progressPercent}%</span>
    </>
  );
};

export default OperationStatusCell;
