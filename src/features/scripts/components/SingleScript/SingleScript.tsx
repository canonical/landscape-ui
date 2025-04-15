import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect, useMemo } from "react";
import { Form, Input, Select } from "@canonical/react-components";
import CodeEditor from "@/components/form/CodeEditor";
import { useScripts } from "../../hooks";
import type { Script, ScriptFormValues } from "../../types";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { CTA_LABELS, SCRIPT_FORM_INITIAL_VALUES } from "./constants";
import {
  getCopyScriptParams,
  getCreateAttachmentsPromises,
  getCreateScriptParams,
  getEditScriptParams,
  getValidationSchema,
} from "./helpers";
import ScriptFormAttachments from "../ScriptFormAttachments";
import { getFormikError } from "@/utils/formikErrors";
import { DEFAULT_SCRIPT } from "../../constants";

type SingleScriptProps =
  | {
      action: "add";
    }
  | {
      action: "copy";
      script: Script;
    }
  | {
      action: "edit";
      script: Script;
    };

const SingleScript: FC<SingleScriptProps> = (props) => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();

  const { getAccessGroupQuery } = useRoles();
  const {
    createScriptQuery,
    editScriptQuery,
    copyScriptQuery,
    getScriptCodeQuery,
    createScriptAttachmentQuery,
    removeScriptAttachmentQuery,
  } = useScripts();

  const { mutateAsync: createScript } = createScriptQuery;
  const { mutateAsync: editScript } = editScriptQuery;
  const { mutateAsync: copyScript } = copyScriptQuery;
  const { mutateAsync: createScriptAttachment } = createScriptAttachmentQuery;
  const { mutateAsync: removeScriptAttachment } = removeScriptAttachmentQuery;

  const handleSubmit = async (values: ScriptFormValues) => {
    const newAttachments = Object.values(values.attachments).filter(
      (attachment) => attachment !== null,
    );

    try {
      if ("add" === props.action) {
        const newScript = await createScript(getCreateScriptParams(values));

        if (newAttachments.length > 0) {
          await Promise.all(
            await getCreateAttachmentsPromises({
              attachments: newAttachments,
              createScriptAttachment,
              script_id: newScript.data.id,
            }),
          );
        }
      } else if ("edit" === props.action) {
        const promises: Promise<unknown>[] = [
          editScript(getEditScriptParams({ props, values })),
        ];

        if (values.attachmentsToRemove.length > 0) {
          for (const attachmentToRemove of values.attachmentsToRemove) {
            promises.push(
              removeScriptAttachment({
                script_id: props.script.id,
                filename: attachmentToRemove,
              }),
            );
          }

          await Promise.all(promises.splice(0));
        }

        if (newAttachments.length > 0) {
          promises.push(
            ...(await getCreateAttachmentsPromises({
              attachments: newAttachments,
              createScriptAttachment,
              script_id: props.script.id,
            })),
          );
        }

        await Promise.all(promises);
      } else if ("copy" === props.action) {
        await copyScript(getCopyScriptParams({ props, values }));
      }

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: SCRIPT_FORM_INITIAL_VALUES,
    validationSchema: getValidationSchema(props.action),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if ("add" === props.action) {
      return;
    }

    if ("copy" === props.action) {
      formik.setFieldValue("access_group", props.script.access_group);
    } else if ("edit" === props.action) {
      formik.setFieldValue("title", props.script.title);
      formik.setFieldValue("time_limit", props.script.time_limit);
      formik.setFieldValue("username", props.script.username);
      formik.setFieldValue("access_group", props.script.access_group);
    }
  }, [props.action]);

  const { data: getScriptCodeResult } = getScriptCodeQuery(
    { script_id: "edit" === props.action ? props.script.id : 0 },
    { enabled: "edit" === props.action },
  );

  useEffect(() => {
    if (!getScriptCodeResult) {
      return;
    }

    formik.setFieldValue("code", getScriptCodeResult.data);
  }, [getScriptCodeResult]);

  const { data: getAccessGroupResult } = getAccessGroupQuery();

  const accessGroupsOptions = useMemo<SelectOption[]>(
    () =>
      (getAccessGroupResult?.data ?? []).map(({ name, title }) => ({
        label: title,
        value: name,
      })),
    [getAccessGroupResult],
  );

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Title"
        required
        {...formik.getFieldProps("title")}
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
      />

      {("add" === props.action || "edit" === props.action) && (
        <>
          <Input
            type="number"
            label="Time limit (seconds)"
            required
            {...formik.getFieldProps("time_limit")}
            error={
              formik.touched.time_limit && formik.errors.time_limit
                ? formik.errors.time_limit
                : undefined
            }
          />

          <CodeEditor
            label="Code"
            required
            onChange={(value) => {
              formik.setFieldValue("code", value ?? "");
            }}
            value={formik.values.code}
            error={
              formik.touched.code && formik.errors.code
                ? formik.errors.code
                : undefined
            }
            defaultValue={DEFAULT_SCRIPT}
          />

          <Input
            type="text"
            label="Run as user"
            {...formik.getFieldProps("username")}
            error={
              formik.touched.username && formik.errors.username
                ? formik.errors.username
                : undefined
            }
          />
        </>
      )}

      <Select
        label="Access group"
        options={[
          { label: "Select access group", value: "" },
          ...accessGroupsOptions,
        ]}
        {...formik.getFieldProps("access_group")}
        error={
          formik.touched.access_group && formik.errors.access_group
            ? formik.errors.access_group
            : undefined
        }
      />

      {("add" === props.action || "edit" === props.action) && (
        <>
          <h5>List of attachments</h5>
          <p className="u-text--muted">
            Attachments that will be sent along with the script. You can attach
            up to 5 files, for a maximum of 1.00MB. Filenames must be unique. On
            the client, the attachments will be placed in the directory whose
            name is accessible through the environment variable
            LANDSCAPE_ATTACHMENTS. They&apos;ll be deleted once the script has
            been run.
          </p>
        </>
      )}

      {("add" === props.action || "edit" === props.action) && (
        <ScriptFormAttachments
          attachments={formik.values.attachments}
          attachmentsToRemove={formik.values.attachmentsToRemove}
          getFileInputError={(key: keyof ScriptFormValues["attachments"]) =>
            getFormikError(formik, ["attachments", key])
          }
          initialAttachments={
            props.action === "edit" ? props.script.attachments : []
          }
          onFileInputChange={(key: keyof ScriptFormValues["attachments"]) =>
            (event) => {
              formik.setFieldValue(
                `attachments.${key}`,
                event.target.files?.[0] ?? null,
              );
            }}
          onInitialAttachmentDelete={(attachment: string) => {
            formik.setFieldValue("attachmentsToRemove", [
              ...formik.values.attachmentsToRemove,
              attachment,
            ]);
          }}
        />
      )}

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={CTA_LABELS[props.action]}
      />
    </Form>
  );
};

export default SingleScript;
