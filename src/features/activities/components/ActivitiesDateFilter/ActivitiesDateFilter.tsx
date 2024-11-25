import tableFilterClasses from "@/components/filter/TableFilter/TableFilter.module.scss";
import {
  Badge,
  Button,
  ContextualMenu,
  Form,
  Input,
} from "@canonical/react-components";
import classNames from "classnames";
import classes from "./ActivitiesDateFilter.module.scss";
import { usePageParams } from "@/hooks/usePageParams";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

interface FormProps {
  fromDate: string;
  toDate: string;
}

const ActivitiesDateFilter = () => {
  const [visible, setVisible] = useState(false);

  const { setPageParams, fromDate, toDate } = usePageParams();

  const formik = useFormik<FormProps>({
    initialValues: {
      fromDate: fromDate || "",
      toDate: toDate || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      fromDate: Yup.string(),
      toDate: Yup.string(),
    }),
    onSubmit: (values) => {
      setPageParams({
        fromDate: values.fromDate,
        toDate: values.toDate,
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
          <span>Date range</span>
          <span className={classNames(tableFilterClasses.badgeContainer)}>
            {fromDate || toDate ? (
              <Badge
                value={fromDate && toDate ? 2 : 1}
                className={tableFilterClasses.badge}
              />
            ) : null}
          </span>
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
        <div className={tableFilterClasses.container}>
          <Input
            type="datetime-local"
            label="From"
            {...formik.getFieldProps("fromDate")}
          />
          <Input
            type="datetime-local"
            label="To"
            {...formik.getFieldProps("toDate")}
          />
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
            Cancel
          </Button>
          <Button small type="submit" appearance="positive">
            Add
          </Button>
        </div>
      </Form>
    </ContextualMenu>
  );
};

export default ActivitiesDateFilter;
