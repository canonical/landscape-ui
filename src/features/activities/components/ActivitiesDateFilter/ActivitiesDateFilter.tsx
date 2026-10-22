import tableFilterClasses from "@/components/filter/TableFilter/TableFilter.module.scss";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Form, Input } from "@canonical/react-components";
import { Badge } from "@canonical/react-ds-global";
import { useFormik } from "formik";
import type { FC, ReactNode } from "react";
import classes from "./ActivitiesDateFilter.module.scss";
import { TableFilter } from "@/components/filter";
import { VALIDATION_SCHEMA } from "./constants";
import type { FormProps } from "./types";

interface ActivitiesDateFilterProps {
  readonly label?: ReactNode;
  readonly inline?: boolean;
  readonly filterControls?: {
    readonly values: FormProps;
    readonly onChange: (values: FormProps) => void;
  };
}

interface ActivitiesDateFilterFormProps {
  readonly values: FormProps;
  readonly onChange: (values: FormProps) => void;
  readonly onClose?: () => void;
}

const ActivitiesDateFilterForm: FC<ActivitiesDateFilterFormProps> = ({
  values,
  onChange,
  onClose,
}) => {
  const formik = useFormik<FormProps>({
    initialValues: values,
    enableReinitialize: true,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (dates) => {
      onChange(dates);
      onClose?.();
    },
  });

  return (
    <Form
      onSubmit={formik.handleSubmit}
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
            onChange({
              fromDate: "",
              toDate: "",
            });
            onClose?.();
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
};

const ActivitiesDateFilter: FC<ActivitiesDateFilterProps> = ({
  label = "Date range",
  inline = false,
  filterControls,
}) => {
  const pageParams = usePageParams();
  const { fromDate, toDate } = filterControls?.values ?? pageParams;
  const setDates = filterControls?.onChange ?? pageParams.setPageParams;

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
          <ActivitiesDateFilterForm
            values={{ fromDate, toDate }}
            onChange={setDates}
            onClose={closeMenu}
          />
        );
      }}
    />
  );
};
export default ActivitiesDateFilter;
