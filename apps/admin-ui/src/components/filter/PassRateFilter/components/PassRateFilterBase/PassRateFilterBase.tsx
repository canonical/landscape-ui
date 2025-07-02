import type { CustomFilterComponentProps } from "@/components/filter/TableFilter";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import classes from "./PassRateFilterBase.module.scss";

interface FormProps {
  passRateFrom: number;
  passRateTo: number;
}

const PassRateFilterBase: FC<CustomFilterComponentProps> = ({ closeMenu }) => {
  const { setPageParams, passRateFrom, passRateTo } = usePageParams();

  const formik = useFormik<FormProps>({
    initialValues: {
      passRateFrom: passRateFrom,
      passRateTo: passRateTo,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      passRateFrom: Yup.number()
        .required("This field is required")
        .min(0, "Must not be negative")
        .integer("Enter an integer")
        .max(100, "Must not be greater than 100"),
      passRateTo: Yup.number()
        .required("This field is required")
        .max(100, "Must not be greater than 100")
        .when("passRateFrom", ([from], schema) =>
          schema.min(from, "Must not be less than minimum pass rate"),
        ),
    }),
    onSubmit: (values) => {
      setPageParams({
        passRateFrom: values.passRateFrom,
        passRateTo: values.passRateTo,
      });
      closeMenu?.();
    },
  });

  return (
    <Form
      onSubmit={formik.handleSubmit}
      noValidate
      className={classes.container}
    >
      <div className={classes.inlineInput}>
        <Input
          className={classes.input}
          type="number"
          label="From"
          min={0}
          max={formik.values.passRateTo}
          {...formik.getFieldProps("passRateFrom")}
          error={getFormikError(formik, "passRateFrom")}
        />
        <span className={classes.percent}>%</span>
      </div>

      <div className={classes.inlineInput}>
        <Input
          className={classes.input}
          type="number"
          label="To"
          min={formik.values.passRateFrom}
          max={100}
          {...formik.getFieldProps("passRateTo")}
          error={getFormikError(formik, "passRateTo")}
        />
        <span className={classes.percent}>%</span>
      </div>

      <div className={classes.buttons}>
        <Button
          small
          type="button"
          appearance="base"
          className="u-no-margin--bottom"
          onClick={() => {
            setPageParams({
              passRateFrom: 0,
              passRateTo: 100,
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
          disabled={!formik.isValid}
        >
          Apply
        </Button>
      </div>
    </Form>
  );
};

export default PassRateFilterBase;
