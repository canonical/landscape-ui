import classNames from "classnames";
import { FormikContextType } from "formik";
import { FC } from "react";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import { Constraint } from "../types";
import classes from "./PackageProfileConstraintsEditFormTableActions.module.scss";

interface PackageProfileConstraintsEditFormTableActionsProps {
  constraint: Constraint;
  formik: FormikContextType<Constraint>;
}

const PackageProfileConstraintsEditFormTableActions: FC<
  PackageProfileConstraintsEditFormTableActionsProps
> = ({ constraint, formik }) => {
  return formik.values.id === constraint.id ? (
    <>
      <Button
        type="button"
        appearance="base"
        hasIcon
        className={classNames(
          "u-no-margin--bottom u-no-padding",
          classes.actionButton,
        )}
        onClick={() => formik.handleSubmit()}
      >
        <Tooltip tooltipClassName={classes.tooltip} message="Save changes">
          <Icon
            name="success-grey"
            className="u-no-margin--left u-no-margin--right"
          />
        </Tooltip>
      </Button>
      <Button
        type="button"
        appearance="base"
        hasIcon
        className="u-no-margin--bottom u-no-padding"
        onClick={() => formik.resetForm()}
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
      onClick={() => formik.setValues(constraint)}
      disabled={formik.values.id !== 0}
      aria-label={`Edit ${constraint.package} constraint`}
    >
      <Tooltip tooltipClassName={classes.tooltip} message="Edit constraint">
        <Icon name="edit" className="u-no-margin--left u-no-margin--right" />
      </Tooltip>
    </Button>
  );
};

export default PackageProfileConstraintsEditFormTableActions;
