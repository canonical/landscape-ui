import classNames from "classnames";
import type { FC } from "react";
import { Tooltip } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import type { Constraint } from "../../types";
import classes from "./PackageProfileConstraintsEditFormTableActions.module.scss";

interface PackageProfileConstraintsEditFormTableActionsProps {
  readonly constraint: Constraint;
  readonly editingConstraintId: number;
  readonly isSubmitting: boolean;
  readonly onEdit: (constraint: Constraint) => void;
  readonly onCancel: () => void;
  readonly onSave: () => void;
}

const PackageProfileConstraintsEditFormTableActions: FC<
  PackageProfileConstraintsEditFormTableActionsProps
> = ({
  constraint,
  editingConstraintId,
  isSubmitting,
  onEdit,
  onCancel,
  onSave,
}) => {
  return editingConstraintId === constraint.id ? (
    <div className={classNames("dense", classes.actions)}>
      <Tooltip tooltipClassName={classes.tooltip} message="Save changes">
        <Button
          type="button"
          importance="tertiary"
          icon="success"
          loading={isSubmitting}
          onClick={() => {
            onSave();
          }}
          aria-label={`Save changes to ${constraint.package} constraint`}
        />
      </Tooltip>
      <Tooltip tooltipClassName={classes.tooltip} message="Cancel">
        <Button
          type="button"
          importance="tertiary"
          icon="error"
          onClick={() => {
            onCancel();
          }}
          aria-label={`Cancel editing ${constraint.package} constraint`}
        />
      </Tooltip>
    </div>
  ) : (
    <Tooltip tooltipClassName={classes.tooltip} message="Edit constraint">
      <Button
        type="button"
        importance="tertiary"
        icon="edit"
        className="dense"
        onClick={() => {
          onEdit(constraint);
        }}
        disabled={editingConstraintId !== 0}
        aria-label={`Edit ${constraint.package} constraint`}
      />
    </Tooltip>
  );
};

export default PackageProfileConstraintsEditFormTableActions;
