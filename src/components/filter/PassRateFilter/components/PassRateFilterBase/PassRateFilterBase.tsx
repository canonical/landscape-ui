import usePageParams from "@/hooks/usePageParams";
import { Button, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import classes from "./PassRateFilterBase.module.scss";

interface FormProps {
  passRateFrom: number;
  passRateTo: number;
}

interface PassRateFilterBaseProps {
  readonly hideMenu: () => void;
}

const PassRateFilterBase: FC<PassRateFilterBaseProps> = ({ hideMenu }) => {
  const { setPageParams, passRateFrom, passRateTo } = usePageParams();

  const formik = useFormik<FormProps>({
    initialValues: {
      passRateFrom: passRateFrom,
      passRateTo: passRateTo,
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      passRateFrom: Yup.number().min(0).max(100),
      passRateTo: Yup.number().min(0).max(100),
    }),
    onSubmit: (values) => {
      setPageParams({
        passRateFrom: values.passRateFrom,
        passRateTo: values.passRateTo,
      });

      hideMenu();
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
        />
        <span className={classes.percent}>%</span>
      </div>

      <div className={classes.buttons}>
        <Button
          small
          type="button"
          appearance="base"
          onClick={() => {
            hideMenu();
            formik.resetForm();
          }}
        >
          Reset
        </Button>
        <Button small type="submit" appearance="positive">
          Apply
        </Button>
      </div>
    </Form>
  );
};

export default PassRateFilterBase;
