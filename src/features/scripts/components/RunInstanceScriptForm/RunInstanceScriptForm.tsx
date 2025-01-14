import { Buffer } from "buffer";
import { useFormik } from "formik";
import type { ChangeEvent, FC } from "react";
import { useMemo } from "react";
import {
  CheckboxInput,
  Form,
  Input,
  Select,
} from "@canonical/react-components";
import CodeEditor from "@/components/form/CodeEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useScripts } from "@/features/scripts";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import type { RunInstanceScriptFormValues } from "../../types";
import AttachmentBlock from "../AttachmentBlock";
import DeliveryBlock from "../DeliveryBlock";
import {
  INITIAL_VALUES,
  SCRIPT_TYPE_OPTIONS,
  VALIDATION_SCHEMA,
} from "./constants";
import { getNotification, getScriptOptions } from "./helpers";
import { DEFAULT_SCRIPT } from "../../constants";

interface RunInstanceScriptFormProps {
  readonly query: string;
}

const RunInstanceScriptForm: FC<RunInstanceScriptFormProps> = ({ query }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();
  const {
    createScriptAttachmentQuery,
    createScriptQuery,
    executeScriptQuery,
    getScriptsQuery,
    removeScriptQuery,
  } = useScripts();

  const { mutateAsync: createScriptAttachment } = createScriptAttachmentQuery;
  const { mutateAsync: createScript } = createScriptQuery;
  const { mutateAsync: executeScript } = executeScriptQuery;
  const { mutateAsync: removeScript } = removeScriptQuery;

  const handleSubmit = async (values: RunInstanceScriptFormValues) => {
    try {
      if (values.type === "existing") {
        await executeScript({
          deliver_after: values.deliverImmediately
            ? values.deliver_after
            : undefined,
          query,
          script_id: values.script_id,
          username: values.username,
        });
      } else {
        const { data } = await createScript({
          title: values.title,
          time_limit: values.time_limit,
          code: Buffer.from(values.code).toString("base64"),
          access_group: values.access_group,
          username: values.username,
        });

        const attachments = Object.values(values.attachments).filter(
          Boolean,
        ) as File[];

        if (attachments.length > 0) {
          const buffers = await Promise.all(
            attachments.map((file) => file.arrayBuffer()),
          );

          const promises = attachments.map(({ name }, index) =>
            createScriptAttachment({
              script_id: data.id,
              file: `${name}$$${Buffer.from(buffers[index]).toString("base64")}`,
            }),
          );

          await Promise.all(promises);
        }

        await executeScript({
          deliver_after: values.deliverImmediately
            ? values.deliver_after
            : undefined,
          query,
          script_id: data.id,
          username: values.username,
        });

        if (!values.saveScript) {
          await removeScript({ script_id: data.id });
        }
      }

      closeSidePanel();

      notify.success(getNotification(values, scriptOptions));
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: handleSubmit,
  });

  const { data: getScriptsQueryResult } = getScriptsQuery();

  const scriptOptions = getScriptOptions(getScriptsQueryResult?.data.results);

  const handleScriptChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const scriptId = parseInt(event.target.value);

    await formik.setFieldValue("script_id", scriptId);

    if (!formik.values.username) {
      const userName =
        getScriptsQueryResult?.data.results.find(({ id }) => id === scriptId)
          ?.username ?? "";

      await formik.setFieldValue("username", userName);
    }
  };

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
      <Select
        label="Type"
        labelClassName="u-off-screen"
        required
        options={SCRIPT_TYPE_OPTIONS}
        {...formik.getFieldProps("type")}
        error={
          formik.touched.type && formik.errors.type
            ? formik.errors.type
            : undefined
        }
      />

      {formik.values.type === "existing" && (
        <Select
          label="Script"
          required
          options={scriptOptions}
          {...formik.getFieldProps("script_id")}
          onChange={handleScriptChange}
          error={
            formik.touched.script_id && formik.errors.script_id
              ? formik.errors.script_id
              : undefined
          }
        />
      )}

      {formik.values.type === "new" && (
        <>
          <Input
            label="Title"
            type="text"
            required
            {...formik.getFieldProps("title")}
            error={
              formik.touched.title && formik.errors.title
                ? formik.errors.title
                : undefined
            }
          />

          <Input
            label="Time limit"
            type="number"
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

          <Select
            label="Access group"
            required
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
        </>
      )}

      <Input
        label="Run as user"
        type="text"
        required
        {...formik.getFieldProps("username")}
        error={
          formik.touched.username && formik.errors.username
            ? formik.errors.username
            : undefined
        }
      />

      {formik.values.type === "new" && (
        <>
          <CheckboxInput
            label="Save script"
            {...formik.getFieldProps("saveScript")}
            checked={formik.values.saveScript}
          />

          <AttachmentBlock formik={formik} />
        </>
      )}

      <DeliveryBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Run script"
      />
    </Form>
  );
};

export default RunInstanceScriptForm;
