import tableFilterClasses from "@/components/filter/TableFilter/TableFilter.module.scss";
import {
  Button,
  ContextualMenu,
  Form,
  Input,
} from "@canonical/react-components";
import classes from "./PassRateFilter.module.scss";
import usePageParams from "@/hooks/usePageParams";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

interface FormProps {
  passRateFrom: number;
  passRateTo: number;
}

const PassRateFilter = () => {
  const [visible, setVisible] = useState(false);

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
      setVisible(false);
    },
  });

  return (
    <ContextualMenu
      visible={visible}
      autoAdjust={true}
      toggleAppearance="base"
      toggleLabel={
        <>
          <span>Pass rate</span>
        </>
      }
      toggleClassName={tableFilterClasses.toggle}
      toggleProps={{
        onClick: () => {
          setVisible(!visible);
        },
      }}
      hasToggleIcon={true}
      dropdownClassName={tableFilterClasses.dropdown}
      position="left"
    >
      <Form
        onSubmit={formik.handleSubmit}
        noValidate
        className={classes.container}
      >
        <div>
          <Input
            type="number"
            label="From"
            min={0}
            max={formik.values.passRateTo}
            {...formik.getFieldProps("passRateFrom")}
          />
          <span>%</span>
        </div>

        <div>
          <Input
            type="number"
            label="To"
            min={formik.values.passRateFrom}
            max={100}
            {...formik.getFieldProps("passRateTo")}
          />
          <span>%</span>
        </div>

        <div className={classes.buttons}>
          <Button
            small
            type="button"
            appearance="base"
            onClick={() => {
              setVisible(false);
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
    </ContextualMenu>
  );
};

export default PassRateFilter;
