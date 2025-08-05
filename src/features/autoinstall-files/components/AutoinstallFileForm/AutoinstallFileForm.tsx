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
import {
  AUTOINSTALL_FILE_EXTENSION,
  AUTOINSTALL_FILE_LANGUAGE,
  AUTOINSTALL_FILE_LANGUAGES,
} from "../../constants";
import { removeAutoinstallFileExtension } from "../../helpers";
import classes from "./AutoinstallFileForm.module.scss";
import { DEFAULT_FILE, VALIDATION_SCHEMA } from "./constants";
import type { FormikProps } from "./types";
import type { AddAutoinstallFileParams } from "../../api";
import { areTextsIdentical } from "./helpers";

interface AutoinstallFileFormProps {
  readonly buttonText: "Add" | "Save changes";
  readonly description: string;
  readonly notification: NotificationMethodArgs;
  readonly onSubmit: (params: AddAutoinstallFileParams) => Promise<unknown>;
  readonly initialFile?: FormikProps;
}

const AutoinstallFileForm: FC<AutoinstallFileFormProps> = ({
  buttonText,
  description,
  initialFile = DEFAULT_FILE,
  notification,
  onSubmit,
}) => {
  const IS_CREATING = buttonText === "Add";
  const inputRef = useRef<HTMLInputElement>(null);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const formik = useFormik<FormikProps>({
    initialValues: {
      contents: initialFile.contents,
      is_default: initialFile.is_default,
      filename: removeAutoinstallFileExtension(initialFile.filename),
    },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (file) => {
      const filename = `${file.filename}${AUTOINSTALL_FILE_EXTENSION}`;

      try {
        await onSubmit({
          contents: file.contents,
          is_default: file.is_default,
          filename,
        });

        closeSidePanel();

        notify.success({
          message: `The autoinstall file ${filename} ${notification.message}`,
          title: `${notification.title} ${filename}`,
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

    const contentsPromise = formik.setFieldValue("contents", await file.text());

    if (formik.values.filename) {
      await contentsPromise;
      return;
    }

    await Promise.all([
      formik.setFieldValue(
        "filename",
        removeAutoinstallFileExtension(file.name),
      ),
      contentsPromise,
    ]);
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
          wrapperClassName={classes.input}
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

      {IS_CREATING && (
        <Input
          type="checkbox"
          label="Default"
          {...formik.getFieldProps("is_default")}
          help="This file will be used to configure newly registered instances. Only one default file can be set at a time."
        />
      )}

      <input
        ref={inputRef}
        className="u-hide"
        type="file"
        accept={AUTOINSTALL_FILE_LANGUAGES.map(
          (language) => `.${language}`,
        ).join(",")}
        onChange={handleInputChange}
      />

      <CodeEditor
        label="Code"
        value={formik.values.contents}
        onChange={handleEditorChange}
        error={getFormikError(formik, "contents")}
        required
        language={AUTOINSTALL_FILE_LANGUAGE}
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
        submitButtonDisabled={
          areTextsIdentical(formik.values.contents, initialFile.contents) ||
          formik.isSubmitting
        }
        submitButtonText={buttonText}
      />
    </Form>
  );
};

export default AutoinstallFileForm;
