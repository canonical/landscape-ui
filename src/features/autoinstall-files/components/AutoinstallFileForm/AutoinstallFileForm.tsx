import CodeEditor from "@/components/form/CodeEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { NotificationMethodArgs } from "@/types/Notification";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Form, Icon, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useRef } from "react";
import classes from "./AutoinstallFileForm.module.scss";
import { VALIDATION_SCHEMA } from "./constants";
import type { FormikProps } from "./types";

interface AutoinstallFileFormProps {
  readonly buttonText: string;
  readonly description: string;
  readonly initialFile?: FormikProps;
  readonly notification: NotificationMethodArgs;
  readonly query: (params: FormikProps) => Promise<unknown>;
}

const AutoinstallFileForm: FC<AutoinstallFileFormProps> = ({
  buttonText,
  description,
  initialFile = {
    contents: "",
    filename: "",
  },
  notification,
  query,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const inputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<FormikProps>({
    initialValues: initialFile,

    validationSchema: VALIDATION_SCHEMA,

    onSubmit: async (autoinstallFile) => {
      try {
        await query(autoinstallFile);
        closeSidePanel();

        notify.success({
          message: `${autoinstallFile.filename} ${notification.message}`,
          title: `${notification.title} ${autoinstallFile.filename}`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <div className={classes.container}>
        <span>{description}</span>

        <div className={classes.inputs}>
          <Input
            type="text"
            label="File name"
            {...formik.getFieldProps("filename")}
            error={getFormikError(formik, "filename")}
            disabled={!!initialFile.filename}
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

              const [file] = files;

              formik.setFieldValue("contents", await file.text());

              if (formik.values.filename) {
                return;
              }

              formik.setFieldValue("filename", file.name);
            }}
          />

          <CodeEditor
            label="Code"
            value={formik.values.contents}
            onChange={(value) => formik.setFieldValue("contents", value)}
            error={getFormikError(formik, "contents")}
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
        submitButtonText={buttonText}
      />
    </Form>
  );
};

export default AutoinstallFileForm;
