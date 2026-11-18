import classNames from "classnames";
import type { FC } from "react";
import {
  ActionButton,
  Button,
  Icon,
  Tooltip,
} from "@canonical/react-components";
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
    <>
      <ActionButton
        type="button"
        appearance="base"
        hasIcon
        className={classNames(
          "u-no-margin--bottom u-no-padding",
          classes.actionButton,
        )}
        onClick={() => {
          onSave();
        }}
        aria-label={`Save changes to ${constraint.package} constraint`}
        loading={isSubmitting}
      >
        <Tooltip tooltipClassName={classes.tooltip} message="Save changes">
          <Icon
            name="success-grey"
            className="u-no-margin--left u-no-margin--right"
          />
        </Tooltip>
      </ActionButton>
      <Button
        type="button"
        appearance="base"
        hasIcon
        className="u-no-margin--bottom u-no-padding"
        onClick={() => {
          onCancel();
        }}
        aria-label={`Cancel editing ${constraint.package} constraint`}
      >
        <Tooltip tooltipClassName={classes.tooltip} message="Cancel">
          <Icon
            name="error-grey"
            className="u-no-margin--left u-no-margin--right"
          />
        </Tooltip>
      </Button>
    </>
  ) : (
    <Button
      type="button"
      appearance="base"
      hasIcon
      className="u-no-margin--bottom u-no-padding"
      onClick={() => {
        onEdit(constraint);
      }}
      disabled={editingConstraintId !== 0}
      aria-label={`Edit ${constraint.package} constraint`}
    >
      <Tooltip tooltipClassName={classes.tooltip} message="Edit constraint">
        <Icon name="edit" className="u-no-margin--left u-no-margin--right" />
      </Tooltip>
    </Button>
  );
};

export default PackageProfileConstraintsEditFormTableActions;
