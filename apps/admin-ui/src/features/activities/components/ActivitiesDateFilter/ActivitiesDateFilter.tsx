import tableFilterClasses from "@/components/filter/TableFilter/TableFilter.module.scss";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Badge, Button, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import classes from "./ActivitiesDateFilter.module.scss";
import { TableFilter } from "@/components/filter";

interface FormProps {
  fromDate: string;
  toDate: string;
}

const ActivitiesDateFilter: FC = () => {
  const { setPageParams, fromDate, toDate } = usePageParams();

  const formik = useFormik<FormProps>({
    initialValues: {
      fromDate: fromDate,
      toDate: toDate,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      fromDate: Yup.date().typeError("Invalid date format"),
      toDate: Yup.date()
        .typeError("Invalid date format")
        .when("fromDate", ([from], schema) =>
          from ? schema.min(from, "To date must be after From date") : schema,
        ),
    }),
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
          <span>Date range</span>
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
