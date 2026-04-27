import CodeEditor from "@/components/form/CodeEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Form, Icon, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useRef } from "react";
import { useBoolean } from "usehooks-ts";
import {
  useCreateScriptAttachment,
  useEditScript,
  useRemoveScriptAttachment,
} from "../../api";
import { DEFAULT_SCRIPT } from "../../constants";
import {
  getCreateAttachmentsPromises,
  getEditScriptParams,
} from "../../helpers";
import type { Script, ScriptFormValues } from "../../types";
import EditScriptConfirmationModal from "../EditScriptConfirmationModal";
import ScriptFormAttachments from "../ScriptFormAttachments";
import {
  getInitialValues,
  getValidationSchema,
  removeFileExtension,
} from "./helpers";

interface EditScriptFormProps {
  readonly script: Script;
  readonly onBack?: () => void;
}

const EditScriptForm: FC<EditScriptFormProps> = ({ script, onBack }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    value: showConfirmationModal,
    setTrue: showModal,
    setFalse: closeModal,
  } = useBoolean();

  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { notify } = useNotify();

  const { createScriptAttachment } = useCreateScriptAttachment();
  const { removeScriptAttachment } = useRemoveScriptAttachment();
  const { editScript, isEditing } = useEditScript();

  const handleSubmit = async (values: ScriptFormValues) => {
    try {
      const newAttachments = Object.values(values.attachments).filter(
        (a) => a !== null,
      );
      const promises: Promise<unknown>[] = [
        editScript(getEditScriptParams({ scriptId: script.id, values })),
      ];
      if (values.attachmentsToRemove.length) {
        for (const filename of values.attachmentsToRemove) {
          promises.push(
            removeScriptAttachment({ script_id: script.id, filename }),
          );
        }
      }
      if (newAttachments.length) {
        promises.push(
          ...(await getCreateAttachmentsPromises({
            attachments: newAttachments,
            createScriptAttachment,
            script_id: script.id,
          })),
        );
      }
      await Promise.all(promises);

      closeModal();
      closeSidePanel();

      notify.success({
        title: `You have successfully submitted a new version of ${script.title}`,
        message:
          "All its associated profiles will now be run using this new version.",
      });
    } catch (error) {
      closeModal();
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: getInitialValues(script),
    validationSchema: getValidationSchema(),
    onSubmit: handleSubmit,
  });

  const handleInputChange = async ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const file = files?.[0];

    if (!file) {
      return;
    }

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
        data-testid="edit-script-upload-input"
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
        initialAttachments={script.attachments}
        onFileInputChange={(key) => async (e) =>
          formik.setFieldValue(
            `attachments.${key}`,
            e.target.files?.[0] ?? null,
          )
        }
        onInitialAttachmentDelete={async (filename) =>
          formik.setFieldValue("attachmentsToRemove", [
            ...formik.values.attachmentsToRemove,
            filename,
          ])
        }
        scriptId={script.id}
      />

      <SidePanelFormButtons
        onSubmit={showModal}
        hasBackButton={!!onBack}
        onBackButtonPress={onBack}
        submitButtonText="Submit new version"
      />

      {showConfirmationModal && (
        <EditScriptConfirmationModal
          script={script}
          onConfirm={formik.handleSubmit}
          confirmButtonLabel="Submit new version"
          isConfirming={isEditing}
          onClose={closeModal}
        />
      )}
    </Form>
  );
};

export default EditScriptForm;
