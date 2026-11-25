import tableFilterClasses from "@/components/filter/TableFilter/TableFilter.module.scss";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input } from "@canonical/react-components";
import { Badge, Button } from "@canonical/react-ds-global";
import classNames from "classnames";
import { useFormik } from "formik";
import type { FC, ReactNode } from "react";
import classes from "./ActivitiesDateFilter.module.scss";
import { TableFilter } from "@/components/filter";
import { VALIDATION_SCHEMA } from "./constants";
import type { FormProps } from "./types";

interface ActivitiesDateFilterProps {
  readonly fromDate: string;
  readonly toDate: string;
  readonly onChange: (values: FormProps) => void;
  readonly label?: ReactNode;
  readonly inline?: boolean;
}

const ActivitiesDateFilter: FC<ActivitiesDateFilterProps> = ({
  label = "Date range",
  inline = false,
  fromDate,
  toDate,
  onChange,
}) => {
  const formik = useFormik<FormProps>({
    initialValues: {
      fromDate: fromDate,
      toDate: toDate,
    },
    enableReinitialize: true,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      onChange({
        fromDate: values.fromDate,
        toDate: values.toDate,
      });
    },
  });

  return (
    <TableFilter
      type="custom"
      label={
        <>
          <span>{label}</span>
          <span className={tableFilterClasses.badgeContainer}>
            {fromDate || toDate ? (
              <Badge value={fromDate && toDate ? 2 : 1} />
            ) : null}
          </span>
        </>
      }
      inline={inline}
      hasToggleIcon
      hasBadge
      position="left"
      customComponent={({ closeMenu }) => {
        return (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
              closeMenu?.();
            }}
            noValidate
            className={classes.container}
          >
            <Input
              type="datetime-local"
              label="From"
              {...formik.getFieldProps("fromDate")}
              error={getFormikError(formik, "fromDate")}
            />
            <Input
              type="datetime-local"
              label="To"
              min={formik.values.fromDate}
              {...formik.getFieldProps("toDate")}
              error={getFormikError(formik, "toDate")}
            />
            <div className={classNames("dense", classes.buttons)}>
              <Button
                type="button"
                importance="tertiary"
                onClick={() => {
                  onChange({
                    fromDate: "",
                    toDate: "",
                  });
                  closeMenu?.();
                }}
              >
                Reset
              </Button>
              <Button type="submit" importance="primary">
                Apply
              </Button>
            </div>
          </Form>
        );
      }}
    />
  );
};
export default ActivitiesDateFilter;
