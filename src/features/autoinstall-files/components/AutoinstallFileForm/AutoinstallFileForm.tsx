import { useFormik } from "formik";
import type { FC, ReactNode } from "react";
import { useRef, useState } from "react";
import { Button, Form, Icon, Input } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { VALIDATION_SCHEMA } from "./constants";
import type { FormProps } from "./types";
import classes from "./AutoinstallFileForm.module.scss";
import CodeEditor from "@/components/form/CodeEditor";

const AutoinstallFileForm: FC<{
  readonly children?: ReactNode;
  readonly createNotificationTitle: (fileName: string) => string | undefined;
  readonly createNotificationMessage: (fileName: string) => string;
  readonly fileName: string;
  readonly fileNameInputDisabled?: boolean;
  readonly submitButtonText: string;
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
  const [code, setCode] = useState<string | undefined>("");
  const inputRef = useRef<HTMLInputElement>(null);

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
              if (files) {
                setCode(await files[0].text());
              }
            }}
          />

          <CodeEditor
            label="Code"
            onChange={setCode}
            value={code}
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
