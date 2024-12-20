import { useFormik } from "formik";
import { FC, ReactNode } from "react";
import { CodeSnippet, Form, Input } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { autoinstallFileCode as code } from "@/tests/mocks/autoinstallFiles";
import { VALIDATION_SCHEMA } from "./constants";
import { FormProps } from "./types";
import classes from "./AutoinstallFileForm.module.scss";

const AutoinstallFileForm: FC<{
  children?: ReactNode;
  createNotificationTitle: (fileName: string) => string | undefined;
  createNotificationMessage: (fileName: string) => string;
  fileName: string;
  fileNameInputDisabled?: boolean;
  submitButtonText: string;
}> = ({
  children,
  createNotificationMessage,
  createNotificationTitle,
  fileName,
  fileNameInputDisabled,
  submitButtonText,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const formik = useFormik<FormProps>({
    initialValues: {
      addMethod: "fromFile",
      fileName,
    },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async ({ fileName }) => {
      try {
        closeSidePanel();

        notify.success({
          title: createNotificationTitle(fileName),
          message: createNotificationMessage(fileName),
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <div className={classes.container}>
        <span>{children}</span>

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
            disabled={fileNameInputDisabled}
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
        submitButtonText={submitButtonText}
      />
    </Form>
  );
};

export default AutoinstallFileForm;
