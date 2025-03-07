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
import { AUTOINSTALL_FILE_EXTENSION } from "../../constants";
import { removeAutoinstallFileExtension } from "../../helpers";
import classes from "./AutoinstallFileForm.module.scss";
import { DEFAULT_FILE, VALIDATION_SCHEMA } from "./constants";
import type { FormikProps } from "./types";

interface AutoinstallFileFormProps {
  readonly buttonText: string;
  readonly description: string;
  readonly notification: NotificationMethodArgs;
  readonly query: (params: FormikProps) => Promise<unknown>;
  readonly initialFile?: FormikProps;
}

const AutoinstallFileForm: FC<AutoinstallFileFormProps> = ({
  buttonText,
  description,
  initialFile = DEFAULT_FILE,
  notification,
  query,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const inputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<FormikProps>({
    initialValues: {
      ...initialFile,
      filename: removeAutoinstallFileExtension(initialFile.filename),
    },

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

  const handleInputChange = async ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!files) {
      return;
    }

    const [file] = files;

    await formik.setFieldValue("contents", await file.text());

    if (formik.values.filename) {
      return;
    }

    await formik.setFieldValue(
      "filename",
      removeAutoinstallFileExtension(file.name),
    );
  };

  const handleEditorChange = async (value?: string): Promise<void> => {
    await formik.setFieldValue("contents", value);
  };

  const clickFileInput = (): void => {
    inputRef.current?.click();
  };

  return (
    <Form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
      <span>{description}</span>

      <div className={classes.inputContainer}>
        <Input
          wrapperClassName={classes.inputWrapper}
          type="text"
          label="File name"
          {...formik.getFieldProps("filename")}
          error={getFormikError(formik, "filename")}
          disabled={!!initialFile.filename}
          required
        />

        <span className={classes.inputDescription}>
          {AUTOINSTALL_FILE_EXTENSION}
        </span>
      </div>

      <input
        ref={inputRef}
        className="u-hide"
        type="file"
        accept={AUTOINSTALL_FILE_EXTENSION}
        onChange={handleInputChange}
      />

      <CodeEditor
        label="Code"
        value={formik.values.contents}
        onChange={handleEditorChange}
        error={getFormikError(formik, "contents")}
        required
        language="yaml"
        headerContent={
          <Button
            className="u-no-margin--bottom"
            appearance="base"
            hasIcon
            onClick={clickFileInput}
            type="button"
          >
            <Icon name="upload" />
            <span>Populate from file</span>
          </Button>
        }
      />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={buttonText}
      />
    </Form>
  );
};

export default AutoinstallFileForm;
