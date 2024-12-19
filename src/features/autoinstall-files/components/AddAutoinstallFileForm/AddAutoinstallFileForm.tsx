import { useFormik } from "formik";
import { FC } from "react";
import { CodeSnippet, Form, Input } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { autoinstallFileCode as code } from "@/tests/mocks/autoinstallFiles";
import {
  INITIAL_VALUES,
  NOTIFICATION_MESSAGE,
  SUBMIT_BUTTON_TEXT,
  VALIDATION_SCHEMA,
} from "./constants";
import { createNotificationTitle } from "./helpers";
import { FormProps } from "./types";
import classes from "./AddAutoinstallFileForm.module.scss";

const AddAutoinstallFileForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async ({ fileName }) => {
      try {
        closeSidePanel();

        notify.success({
          title: createNotificationTitle(fileName),
          message: NOTIFICATION_MESSAGE,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <div className={classes.container}>
        <span>
          Add autoinstall file. It can be applied during the initial setup of
          associated instances.
        </span>

        <div className={classes.inputs}>
          <div className={classes.radioGroup}>
            <Input
              type="radio"
              label="From a file"
              {...formik.getFieldProps("addMethod")}
              value="fromFile"
              checked={formik.values.addMethod === "fromFile"}
            />

            <Input
              type="radio"
              label="Plain text"
              {...formik.getFieldProps("addMethod")}
              value="plainText"
              checked={formik.values.addMethod === "plainText"}
            />
          </div>

          <Input
            type="text"
            label="File name"
            {...formik.getFieldProps("fileName")}
            error={
              formik.touched.fileName && formik.errors.fileName
                ? formik.errors.fileName
                : undefined
            }
          />

          <CodeSnippet
            className={classes.code}
            blocks={[
              {
                title: "* Code",
                code,
                wrapLines: true,
              },
            ]}
          />
        </div>
      </div>

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={SUBMIT_BUTTON_TEXT}
      />
    </Form>
  );
};

export default AddAutoinstallFileForm;
