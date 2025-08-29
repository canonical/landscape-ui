import CodeEditor from "@/components/form/CodeEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { NotificationMethodArgs } from "@/types/Notification";
import { getFormikError } from "@/utils/formikErrors";
import {
  Button,
  ConfirmationModal,
  Form,
  Icon,
  Input,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useRef, useState } from "react";
import {
  AUTOINSTALL_FILE_EXTENSION,
  AUTOINSTALL_FILE_LANGUAGE,
  AUTOINSTALL_FILE_LANGUAGES,
} from "../../constants";
import { removeAutoinstallFileExtension } from "../../helpers";
import classes from "./AutoinstallFileForm.module.scss";
import { DEFAULT_FILE, VALIDATION_SCHEMA } from "./constants";
import type { FormikProps } from "./types";
import {
  useValidateAutoinstallFile,
  type AddAutoinstallFileParams,
} from "../../api";
import {
  areTextsIdentical,
  isAutoinstallOverrideWarning,
  parseFields,
} from "./helpers";
import { useBoolean } from "usehooks-ts";

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
  const [overrideDetails, setOverrideDetails] = useState<string[]>([]);
  const {
    setTrue: showOverrideWarningModal,
    setFalse: hideOverrideWarningModal,
    value: isOverrideWarningModalVisible,
  } = useBoolean();

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { validateAutoinstallFile, isAutoinstallFileValidating } =
    useValidateAutoinstallFile();

  const executeSubmit = async (file: FormikProps, accept_warning = false) => {
    const filename = `${file.filename}${AUTOINSTALL_FILE_EXTENSION}`;

    try {
      await onSubmit({
        contents: file.contents,
        is_default: file.is_default,
        filename,
        accept_warning,
      });

      closeSidePanel();
      notify.success({
        message: `The autoinstall file ${filename} ${notification.message}`,
        title: `${notification.title} ${filename}`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<FormikProps>({
    initialValues: {
      contents: initialFile.contents,
      is_default: initialFile.is_default,
      filename: removeAutoinstallFileExtension(initialFile.filename),
    },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (file) => {
      try {
        await validateAutoinstallFile({
          contents: file.contents,
        });

        await executeSubmit(file, false);
      } catch (error) {
        if (isAutoinstallOverrideWarning(error)) {
          const parsedFields = parseFields(error);
          setOverrideDetails(parsedFields);
          showOverrideWarningModal();
        } else {
          debug(error);
        }
      }
    },
  });

  const handleConfirmOverride = async (): Promise<void> => {
    formik.setSubmitting(true);
    await executeSubmit(formik.values, true);
    hideOverrideWarningModal();
  };

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
          formik.isSubmitting ||
          isAutoinstallFileValidating
        }
        submitButtonLoading={isAutoinstallFileValidating || formik.isSubmitting}
        submitButtonText={buttonText}
      />

      {isOverrideWarningModalVisible && (
        <ConfirmationModal
          title="Override autoinstall file"
          confirmButtonLabel="Override and add file"
          confirmButtonAppearance="negative"
          confirmButtonLoading={formik.isSubmitting}
          onConfirm={handleConfirmOverride}
          close={hideOverrideWarningModal}
          confirmButtonProps={{ type: "button" }}
        >
          <p>
            The autoinstall file you submitted overrides the following fields:
          </p>
          <ul>
            {overrideDetails.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
          <p>
            Overriding these fields could cause client registration to fail if
            not formatted correctly.
          </p>
        </ConfirmationModal>
      )}
    </Form>
  );
};

export default AutoinstallFileForm;
