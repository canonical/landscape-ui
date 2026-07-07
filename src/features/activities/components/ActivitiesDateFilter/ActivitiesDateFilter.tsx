import tableFilterClasses from "@/components/filter/TableFilter/TableFilter.module.scss";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Badge, Button, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC, ReactNode } from "react";
import classes from "./ActivitiesDateFilter.module.scss";
import { TableFilter } from "@/components/filter";
import { VALIDATION_SCHEMA } from "./constants";
import type { FormProps } from "./types";

interface ActivitiesDateFilterProps {
  readonly label?: ReactNode;
  readonly inline?: boolean;
}

const ActivitiesDateFilter: FC<ActivitiesDateFilterProps> = ({
  label = "Date range",
  inline = false,
}) => {
  const { setPageParams, fromDate, toDate } = usePageParams();

  const formik = useFormik<FormProps>({
    initialValues: {
      fromDate: fromDate,
      toDate: toDate,
    },
    enableReinitialize: true,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      setPageParams({
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
              <Badge
                value={fromDate && toDate ? 2 : 1}
                className={tableFilterClasses.badge}
              />
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
            <div className={classes.buttons}>
              <Button
                small
                type="button"
                appearance="base"
                className="u-no-margin--bottom"
                onClick={() => {
                  setPageParams({
                    fromDate: "",
                    toDate: "",
                  });
                  closeMenu?.();
                }}
              >
                Reset
              </Button>
              <Button
                small
                type="submit"
                appearance="positive"
                className="u-no-margin--bottom"
              >
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
