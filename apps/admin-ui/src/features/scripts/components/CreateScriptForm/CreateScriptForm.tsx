import CodeEditor from "@/components/form/CodeEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Form, Icon, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useRef } from "react";
import { useCreateScript, useCreateScriptAttachment } from "../../api";
import { DEFAULT_SCRIPT } from "../../constants";
import {
  getCreateAttachmentsPromises,
  getCreateScriptParams,
  removeFileExtension,
} from "../../helpers";
import type { ScriptFormValues } from "../../types";
import ScriptFormAttachments from "../ScriptFormAttachments";
import { SCRIPT_FORM_INITIAL_VALUES } from "./constants";
import { getValidationSchema } from "./helpers";

const CreateScript: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { getAccessGroupQuery } = useRoles();

  const { createScript } = useCreateScript();
  const { createScriptAttachment } = useCreateScriptAttachment();
  const { data: accessGroupsResults } = getAccessGroupQuery();

  const accessGroupsData = accessGroupsResults?.data ?? [];

  const accessGroupOptions: SelectOption[] = accessGroupsData.map(
    (accessGroup) => ({
      label: accessGroup.title,
      value: accessGroup.name,
    }),
  );

  const handleSubmit = async (values: ScriptFormValues) => {
    const newAttachments = Object.values(values.attachments).filter(
      (a) => a !== null,
    );
    try {
      const newScript = await createScript(getCreateScriptParams(values));
      if (newAttachments.length) {
        await Promise.all(
          await getCreateAttachmentsPromises({
            attachments: newAttachments,
            createScriptAttachment,
            script_id: newScript.data.id,
          }),
        );
      }
      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: SCRIPT_FORM_INITIAL_VALUES,
    validationSchema: getValidationSchema(),
    onSubmit: handleSubmit,
  });

  const handleInputChange = async ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!files) return;
    const [file] = files;
    const contentsPromise = formik.setFieldValue("code", await file.text());
    if (formik.values.title) {
      await contentsPromise;
      return;
    }
    await Promise.all([
      formik.setFieldValue("title", removeFileExtension(file.name)),
      contentsPromise,
    ]);
  };

  const handleEditorChange = async (value?: string) => {
    await formik.setFieldValue("code", value);
  };

  const clickFileInput = () => inputRef.current?.click();

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Title"
        required
        {...formik.getFieldProps("title")}
        error={getFormikError(formik, "title")}
      />

      <input
        ref={inputRef}
        className="u-hide"
        type="file"
        onChange={handleInputChange}
      />

      <CodeEditor
        label="Code"
        value={formik.values.code}
        onChange={handleEditorChange}
        error={getFormikError(formik, "code")}
        required
        defaultValue={DEFAULT_SCRIPT}
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

      <Select
        label="Access group"
        {...formik.getFieldProps("access_group")}
        options={accessGroupOptions}
        error={getFormikError(formik, "access_group")}
      />

      <>
        <h5>List of attachments</h5>
        <p className="u-text--muted">
          Attachments that will be sent along with the script. You can attach up
          to 5 files, for a maximum of 1.00MB. Filenames must be unique. On the
          client, the attachments will be placed in the directory whose name is
          accessible through the environment variable LANDSCAPE_ATTACHMENTS.
          They&apos;ll be deleted once the script has been run.
        </p>
      </>

      <ScriptFormAttachments
        attachments={formik.values.attachments}
        attachmentsToRemove={formik.values.attachmentsToRemove}
        getFileInputError={(key) =>
          getFormikError(formik, ["attachments", key])
        }
        initialAttachments={[]}
        onFileInputChange={(key) => async (e) =>
          formik.setFieldValue(
            `attachments.${key}`,
            e.target.files?.[0] ?? null,
          )
        }
        onInitialAttachmentDelete={(attachment: string) => {
          formik.setFieldValue("attachmentsToRemove", [
            ...formik.values.attachmentsToRemove,
            attachment,
          ]);
        }}
      />

      <SidePanelFormButtons
        submitButtonText="Create script"
        submitButtonDisabled={formik.isSubmitting}
      />
    </Form>
  );
};

export default CreateScript;
