import { useFormik } from "formik";
import { FC, ReactNode, useRef } from "react";
import { Button, Form, Icon, Input } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { VALIDATION_SCHEMA } from "./constants";
import { FormProps } from "./types";
import classes from "./AutoinstallFileForm.module.scss";
import CodeEditor from "@/components/form/CodeEditor";

const AutoinstallFileForm: FC<{
  children?: ReactNode;
  code?: string;
  createNotificationTitle: (fileName: string) => string | undefined;
  createNotificationMessage: (fileName: string) => string;
  fileName?: string;
  fileNameInputDisabled?: boolean;
  submitButtonText: string;
}> = ({
  children,
  code = "",
  createNotificationMessage,
  createNotificationTitle,
  fileName = "",
  fileNameInputDisabled,
  submitButtonText,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const inputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<FormProps>({
    initialValues: {
      fileName,
      code,
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
            required
          />

          <input
            ref={inputRef}
            className={classes.hidden}
            type="file"
            accept=".yaml"
            onChange={async ({ target: { files } }) => {
              if (!files) {
                return;
              }

              formik.setFieldValue("code", await files[0].text());

              if (formik.values.fileName) {
                return;
              }

              formik.setFieldValue("fileName", files[0].name);
            }}
          />

          <CodeEditor
            className={classes.editor}
            label="Code"
            {...formik.getFieldProps("code")}
            required
            language="yaml"
            headerContent={
              <Button
                className="u-no-margin--bottom"
                appearance="base"
                hasIcon
                onClick={() => {
                  inputRef.current?.click();
                }}
                type="button"
              >
                <Icon name="upload" />
                <span>Populate from file</span>
              </Button>
            }
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
